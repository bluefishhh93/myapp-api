/* eslint-disable */
export default async () => {
    const t = {
        ["./users/models/user.model"]: await import("./users/models/user.model")
    };
    return { "@nestjs/swagger/plugin": { "models": [], "controllers": [[import("./app.controller"), { "AppController": { "getHello": { type: String }, "getHelloName": { type: String } } }], [import("./users/users.controller"), { "UserController": { "createUserAndGenerateToken": {}, "generateVerificationToken": {}, "verifyEmail": {} } }]] }, "@nestjs/graphql/plugin": { "models": [[import("./auth/dto/signup.input"), { "SignupInput": { email: {}, password: {}, firstname: { nullable: true }, lastname: { nullable: true }, role: { nullable: true } } }], [import("./auth/models/token.model"), { "Token": { accessToken: {}, refreshToken: {} } }], [import("./common/models/base.model"), { "BaseModel": { id: {}, createdAt: {}, updatedAt: {} } }], [import("./posts/models/post.model"), { "Post": { title: {}, content: { nullable: true }, published: {}, author: { nullable: true }, status: {} } }], [import("./users/models/user.model"), { "User": { email: {}, firstname: { nullable: true }, lastname: { nullable: true }, role: {}, posts: { nullable: true }, image: { nullable: true }, emailVerified: { nullable: true }, createdAt: {}, updatedAt: {} } }], [import("./auth/models/auth.model"), { "Auth": { user: { type: () => t["./users/models/user.model"].User } } }], [import("./auth/dto/login.input"), { "LoginInput": { email: {}, password: {} } }], [import("./auth/dto/refresh-token.input"), { "RefreshTokenInput": { token: {} } }], [import("./users/dto/change-password.input"), { "ChangePasswordInput": { oldPassword: {}, newPassword: {} } }], [import("./users/dto/update-user.input"), { "UpdateUserInput": { firstname: { nullable: true }, lastname: { nullable: true }, image: { nullable: true } } }], [import("./common/pagination/pagination.args"), { "PaginationArgs": { skip: { nullable: true, type: () => Number }, after: { nullable: true, type: () => String }, before: { nullable: true, type: () => String }, first: { nullable: true, type: () => Number }, last: { nullable: true, type: () => Number } } }], [import("./posts/args/post-id.args"), { "PostIdArgs": { postId: {} } }], [import("./posts/args/user-id.args"), { "UserIdArgs": { userId: { type: () => String } } }], [import("./common/pagination/page-info.model"), { "PageInfo": { endCursor: { nullable: true }, hasNextPage: {}, hasPreviousPage: {}, startCursor: { nullable: true } } }], [import("./posts/models/post-connection.model"), { "PostConnection": {} }], [import("./posts/dto/post-order.input"), { "PostOrder": { field: {} } }], [import("./posts/dto/createPost.input"), { "CreatePostInput": { content: {}, title: {} } }], [import("./posts/dto/updatePost.input"), { "UpdatePostInput": { title: { nullable: true }, content: { nullable: true }, published: { nullable: true } } }]] } };
};