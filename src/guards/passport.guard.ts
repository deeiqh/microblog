import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Unauthorized } from "http-errors";
import { prisma } from "../prisma";
import { TokenActivity } from "../utils/enums";

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
    },
    async (jwtPayload, done) => {
      const tokenRecord = await prisma.token.findUnique({
        where: {
          sub: jwtPayload.sub,
        },
        select: {
          user_id: true,
          activity: true,
        },
      });

      if (!tokenRecord || tokenRecord.activity !== TokenActivity.AUTHENTICATE) {
        return done(new Unauthorized("Invalid token"), null);
      }

      if (jwtPayload.exp < new Date().getTime()) {
        await prisma.token.delete({
          where: {
            sub: jwtPayload.sub as string,
          },
        });
        return done(
          new Unauthorized("Expired token. Now you are signed out"),
          null
        );
      }

      return done(null, tokenRecord.user_id);
    }
  )
);
