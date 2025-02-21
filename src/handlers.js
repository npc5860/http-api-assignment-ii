const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const users = {};

const writeResponse = (request, response, status, object) => {
  const content = JSON.stringify(object);

  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
};

const getIndex = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/html',
  });
  response.write(index);
  response.end();
};

const getStyle = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/css',
  });
  response.write(style);
  response.end();
};

const getUsers = (request, respose) => {
  writeResponse(request, respose, 200, users);
};

const notFound = (request, response) => {
  const object = {
    message: `${request.url} not found.`,
    id: 'notFound',
  };
  writeResponse(request, response, 404, object);
};

const notReal = (request, response) => {
  const object = {
    message: 'this page is fake!',
    id: 'notReal',
  };
  writeResponse(request, response, 404, object);
};

const addUser = (request, response) => {
  const { name, age } = request.body;
  if (!name || !age) {
    const object = {
      message: 'Name and age are both required.',
      id: 'missingParameters',
    };
    writeResponse(request, response, 400, object);
    return;
  }

  let statusCode = 204; // updated

  if (!users[name]) {
    statusCode = 201; // created
    users[name] = {
      name,
    };
  }
  users[name].age = age;

  if (statusCode === 201) {
    const object = {
      message: 'Created Successfully',
    };
    writeResponse(request, response, statusCode, object);
    return;
  }

  writeResponse(request, response, statusCode, {});
};

module.exports = {
  getIndex,
  getStyle,
  getUsers,
  notFound,
  notReal,
  addUser,
};
