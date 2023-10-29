// @flow
import { innerEntityObject } from '../../internal/singleton';
import { buildDefinitions } from '../../swagger/definitions';

/**
 * Description 生成实体类的唯一标识，这里首先默认使用实体类名作为唯一标识
 * @param target
 * @param key
 * @param descriptor
 */
export function generateEntityUUID(
  target: any,
  key: string,
  descriptor: Object
) {
  return target.constructor.name;
}

/**
 * Description 为某个类加上注解，并且创建新的对象以触发内部迭代注解
 * @param Class
 * @returns {*}
 */
export function entity(Class: Function) {
  new Class();
  return Class;
}

export type EntityPropertyParams = {
  // 生成接口文档需要的参数
  type?: 'string',
  description?: 'string',
  required?: boolean,
  defaultValue?: any,

  // 进行校验所需要的参数
  pattern?: 'string',

  // 进行数据库连接需要的参数
  primaryKey?: boolean
};

/**
 * Description 创建某个属性的描述
 * @param type 基础类型 self - 表示为自身
 * @param description 描述
 * @param required 是否为必要参数
 * @param defaultValue 默认值
 * @param pattern
 * @param primaryKey 是否为主键
 * @returns {Function}
 */
export function entityProperty({
  // 生成接口文档需要的参数
  type = 'string',
  description = '',
  required = false,
  defaultValue = undefined,

  // 进行校验所需要的参数
  pattern = undefined,

  // 进行数据库连接需要的参数
  primaryKey = false
}: EntityPropertyParams) {
  return function(target: any, key: string, descriptor: Object) {
    let entityUUID = generateEntityUUID(
      (target: any),
      (key: string),
      (descriptor: Object)
    );

    // 确保实体键存在
    _ensure(entityUUID, key);

    let valueObject = innerEntityObject[entityUUID]['properties'][key];

    // 判断是否为自身
    if (type === 'self' || type === undefined) {
      valueObject.type = target.constructor;
    } else if (
      Array.isArray(type) &&
      (type[0] === 'self' || type[0] === undefined)
    ) {
      valueObject.type = [target.constructor];
    } else {
      valueObject.type = type;

      // 这里动态编译关联的定义项目，需要根据输入的是否为数组来动态提取出具体的实体类或者对象
      Array.isArray(type) ? buildDefinitions(type[0]) : buildDefinitions(type);
    }

    // 设置描述
    valueObject.description = description;

    // 如果是必须属性，则添加到列表中
    if (required) {
      innerEntityObject[entityUUID]['required'].push(key);

      // 对应地不允许为空
      valueObject.allowNull = false;
    } else {
      // 允许为空
      valueObject.allowNull = true;
    }

    // 设置其他属性
    valueObject.pattern = pattern;
    valueObject.defaultValue = defaultValue;
    valueObject.primaryKey = primaryKey;

    // 这里需要设置下 writeable 为 true
    descriptor.writable = true;

    return descriptor;
  };
}

/**
 * Description 初始化存储对象
 * @param entityUUID 实体唯一标识，目前也就是实体名
 * @param property 当前的属性名
 * @private
 */
function _ensure(entityUUID, property) {
  innerEntityObject[entityUUID] || (innerEntityObject[entityUUID] = {});

  innerEntityObject[entityUUID]['required'] ||
    (innerEntityObject[entityUUID]['required'] = []);

  innerEntityObject[entityUUID]['properties'] ||
    (innerEntityObject[entityUUID]['properties'] = {});

  innerEntityObject[entityUUID]['properties'][property] ||
    (innerEntityObject[entityUUID]['properties'][property] = {});
}
