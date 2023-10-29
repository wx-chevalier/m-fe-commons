// @flow

import {
  apiDescription,
  apiRequestMapping,
  apiResponse,
  bodyParameter,
  pathParameter,
  queryParameter
} from "../../src/swagger/decorator";
import User from "../entity/auth/User";

export default class UserControllerDoc {
  @apiResponse(200, "get users successfully", [User])
  static async getUsers(ctx, next): [User] {}

  @pathParameter({
    name: "id",
    description: "user id",
    type: "integer",
    defaultValue: 1
  })
  @queryParameter({
    name: "tags",
    description: "user tags, for filtering users",
    required: false,
    type: "array",
    items: ["string"]
  })
  @apiResponse(200, "get user successfully", User)
  static async getUserByID(ctx, next): User {}

  @bodyParameter({
    name: "user",
    description: "the new user object, must include user name",
    required: true,
    schema: User
  })
  @apiResponse(200, "create new user successfully", {
    statusCode: 200
  })
  static async postUser(): number {}
}
