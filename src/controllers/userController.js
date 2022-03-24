// External module imports
const httpStatus = require('http-status');

// Internal module imports
const config = require('../config/config');
const asyncHandler = require('../middleware/common/asyncHandler');
const {
  SuccessResponse,
  mappedDocuments,
  mappedMetadata,
} = require('../utils');
const { userService } = require('../services');

/**
 * @desc Create user
 * @route POST /api/v1/users
 * @access Private
 */
const createUser = asyncHandler(async (req, res) => {
  const { name, username, email, password, role } = req.body;
  const { path: profilePicture } = req.file;
  // define user object
  const newUser = { name, username, email, password, role, profilePicture };
  // create a new user
  const user = await userService.createUser(newUser);
  // send response
  res.status(httpStatus.CREATED).json(
    new SuccessResponse(httpStatus.OK, httpStatus[httpStatus.OK], {
      user,
    })
  );
});

/**
 * @desc Get user by id
 * @route GET /api/v1/users/:userId
 * @access Private
 */
const getUser = asyncHandler(async (req, res, next) => {
  res.status(httpStatus.OK).json(
    new SuccessResponse(httpStatus.OK, httpStatus[httpStatus.OK], {
      user: req.user,
    })
  );
});

/**
 * @desc Get all users
 * @route GET /api/v1/users
 * @access Private
 */
const getUsers = asyncHandler(async (req, res, next) => {
  // define query object
  const query = { ...req.query, include_metadata: true };
  const { docs, ...meta } = await userService.queryUsers(query);

  // create full url
  const fullUrl = `${req.protocol}://${req.hostname}:${config.port}${req.baseUrl}`;

  // mapped users object
  const users = await mappedDocuments(docs, fullUrl, 'GET');

  // mapped metadata object
  const metadata = mappedMetadata(meta, fullUrl, req.query);

  // set response headers
  res.header('X-Total-Count', metadata.totalDocs);
  res.header('X-Total-Pages', metadata.totalPages);
  res.links(metadata.links);

  // send response with metadata
  if (req.query.include_metadata) {
    return res
      .status(httpStatus.OK)
      .json(
        new SuccessResponse(
          httpStatus.OK,
          httpStatus[httpStatus.OK],
          { users },
          { ...metadata }
        )
      );
  }
  // send response without metadata
  return res
    .status(httpStatus.OK)
    .json(
      new SuccessResponse(httpStatus.OK, httpStatus[httpStatus.OK], { users })
    );
});

/**
 * @desc Update user by id
 * @route PUT /api/v1/users/:userId
 * @access Private
 */
const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const updateBody = {
    name,
    email,
    password,
    role,
  };
  const user = await userService.updateUserById(req.params.userId, updateBody);
  res.status(httpStatus.OK).json(
    new SuccessResponse(httpStatus.OK, httpStatus[httpStatus.OK], {
      user,
    })
  );
});

/**
 * @desc Delete user by id
 * @route DELETE /api/v1/users/:userId
 * @access Private
 */
const deleteUser = asyncHandler(async (req, res, next) => {
  await userService.deleteUserById(req.params.userId, req.body);
  res
    .status(httpStatus.NO_CONTENT)
    .json(new SuccessResponse(httpStatus.NO_CONTENT));
});

// Module exports
module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
