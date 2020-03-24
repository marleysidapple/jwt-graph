import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware, Int } from 'type-graphql';
import { User } from './../entity/User';
import { MyContext } from './../MyContext';
import { hash, compare } from 'bcryptjs';
import {createAccessToken, createRefreshToken, isAuthenticated} from './../auth'
import { sendRefreshToken } from './../sendRefreshToken';
import { getConnection } from 'typeorm';


@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string
}


@Resolver()
export class UserResolver {

  @Query(() => String)
  hello() {
    return "Hi!!!!"
  }

  @Query(() => String)
  @UseMiddleware(isAuthenticated)
  bye(
    @Ctx() {payload} :  MyContext
  ) {
    return `Byee!! I am authenticated.... User id is ${payload!.userId}`
  }

  @Query(() => [User])
  @UseMiddleware(isAuthenticated)
  users() {
    return User.find()
  }


  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    // check if user exists
    const user = await User.findOne({ where: { email } })  // or { email: email }
    if (!user) {
      throw new Error("Invalid login!!");
    }
    //check password hash
    const valid = await compare(password, user.password)

    if (!valid) {
      throw new Error("Invalid login!!");
    }
    //cookie set for refreshtoken
    sendRefreshToken(res, createRefreshToken(user))

    //jwt creating token
    return {
      accessToken: createAccessToken(user)
    };
  }


  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(
    @Arg('userId', () => Int) userId: number
  ) {
    await getConnection()
          .getRepository(User)
          .increment({id: userId}, 'tokenVersion', 1);
    return true;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const hashedPassword = await hash(password, 14)
    try {
      await User.insert({
        email,
        password: hashedPassword
      });
    } catch (error) {
      console.log(error);
      return false;
    }
    return true
  }

}
