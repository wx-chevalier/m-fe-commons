export const swaggerHTML = apiPath =>
  `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Swagger UI</title>
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Source+Code+Pro:300,600|Titillium+Web:400,600,700" rel="stylesheet">
  <link href="https://cdn.bootcss.com/swagger-ui/3.0.14/swagger-ui.css" rel="stylesheet">
  <link rel="icon" type="image/png"
        href="https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/10/1/favicon-32x32.png" sizes="32x32"/>
  <link rel="icon" type="image/png"
        href="https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/10/1/favicon-16x16.png" sizes="16x16"/>
  <style>
    html
    {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
    }
    *,
    *:before,
    *:after
    {
        box-sizing: inherit;
    }
    body {
      margin:0;
      background: #fafafa;
    }
    
    .corner-svg {
        fill: #70B7FD;
        color: #fff;
        position: fixed;
        top: 0;
        border: 0;
        left: 0;
        transform: scale(-1, 1)
    }
    
    .github-corner:hover .octo-arm {
      animation: octocat-wave 560ms ease-in-out
    }
    
    @keyframes octocat-wave {
      0%, 100% {
        transform: rotate(0)
      }
      20%, 60% {
        transform: rotate(-25deg)
      }
      40%, 80% {
        transform: rotate(10deg)
      }
    }
    
    @media(max-width: 500px) {
      .github-corner:hover .octo-arm {
        animation: none
      }
      .github-corner .octo-arm {
        animation: octocat-wave 560ms ease-in-out
      }
    }

  </style>
</head>

<body>
  
  <a
    target="__blank"
    href="https://github.com/wxyyxc1992/decorator-x"
    className="github-corner"
    aria-label="View source on Github"
  >
    <svg
      width="80"
      height="80"
      viewBox="0 0 250 250"
      class="corner-svg"
      aria-hidden="true"
    >
      <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
      <path
        d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
        fill="currentColor"
        style="transform-origin:130px 106px;"
        class="octo-arm"
      />
      <path
        d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
        fill="currentColor"
        class="octo-body"
      />
    </svg>
  </a>
  
  <svg xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" style="position:absolute;width:0;height:0">
    <defs>
      <symbol viewBox="0 0 20 20" id="unlocked">
            <path d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V6h2v-.801C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8z"></path>
      </symbol>
  
      <symbol viewBox="0 0 20 20" id="locked">
        <path d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8zM12 8H8V5.199C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8z"/>
      </symbol>
  
      <symbol viewBox="0 0 20 20" id="close">
        <path d="M14.348 14.849c-.469.469-1.229.469-1.697 0L10 11.819l-2.651 3.029c-.469.469-1.229.469-1.697 0-.469-.469-.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-.469-.469-.469-1.228 0-1.697.469-.469 1.228-.469 1.697 0L10 8.183l2.651-3.031c.469-.469 1.228-.469 1.697 0 .469.469.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c.469.469.469 1.229 0 1.698z"/>
      </symbol>
  
      <symbol viewBox="0 0 20 20" id="large-arrow">
        <path d="M13.25 10L6.109 2.58c-.268-.27-.268-.707 0-.979.268-.27.701-.27.969 0l7.83 7.908c.268.271.268.709 0 .979l-7.83 7.908c-.268.271-.701.27-.969 0-.268-.269-.268-.707 0-.979L13.25 10z"/>
      </symbol>
  
      <symbol viewBox="0 0 20 20" id="large-arrow-down">
        <path d="M17.418 6.109c.272-.268.709-.268.979 0s.271.701 0 .969l-7.908 7.83c-.27.268-.707.268-.979 0l-7.908-7.83c-.27-.268-.27-.701 0-.969.271-.268.709-.268.979 0L10 13.25l7.418-7.141z"/>
      </symbol>
  
  
      <symbol viewBox="0 0 24 24" id="jump-to">
        <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"/>
      </symbol>
  
      <symbol viewBox="0 0 24 24" id="expand">
        <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
      </symbol>
  
    </defs>
  </svg>
  
  <div id="swagger-ui"></div>
  
  <script src="https://cdn.bootcss.com/swagger-ui/3.0.14/swagger-ui-bundle.js"></script>
  <script src="https://cdn.bootcss.com/swagger-ui/3.0.14/swagger-ui-standalone-preset.js"></script>
  <script>
  window.onload = function() {
    // Build a system
    const ui = SwaggerUIBundle({
      url: "${apiPath}",
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
      ],
      layout: "StandaloneLayout"
    })
    window.ui = ui
  }
  </script>
</body>

</html>

`;
