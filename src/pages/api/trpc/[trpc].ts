import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

const s3 = new S3Client({ region: "us-east-1" });
const BUCKET = "isingmodeldata";

const appRouter = trpc
  .router()
  .mutation("imageupload", {
    input: z.object({
      image: z.string(),
      pathname: z.string(),
      index: z.number(),
    }),
    resolve({ input }) {
      let link;

      const buf = Buffer.from(
        input.image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      let params = {
        Key: `${input.pathname}/${Date.now()}/img/${input.index}.png`,
        Bucket: BUCKET,
        Body: buf,
      };

      try {
        s3.send(new PutObjectCommand(params));
      } catch (e) {
        console.log(e);
        link = "Error";
      }

      return {
        link: `https://${BUCKET}.s3.amazonaws.com${
          input.pathname
        }/${Date.now()}/img/${input.index}.png`,
      };
    },
  })
  .mutation("dataupload", {
    input: z.object({
      pathname: z.string(),
      settings: z.object({
        freePlay: z.boolean(),
        initialTemp: z.number().nullish(),
        minTemp: z.number().nullish(),
        maxTemp: z.number().nullish(),
        qpotts: z.number(),
        tempStep: z.number().nullish(),
        fixedTemp: z.boolean(),
        equilibriationDelay: z.number().nullish(),
        numberOfCycles: z.number().nullish(),
        latticeSize: z.number(),
        stepsPerFrame: z.number().nullish(),
        couplingStrength: z.number(),
        moleRatio: z.object({
          up: z.number(),
          down: z.number(),
        }),
        magneticField: z.number().nullish(),
        localMagneticField: z.number().nullish(),
        magnetism: z.string(),
        boundariesConditions: z.string(),
        geometicPattern: z.string(),
        nanotubeSimulation: z.object({
          width: z.number().nullish(),
          height: z.number(),
          diameter: z.number().nullish(),
          spin: z.boolean(),
        }),
        fixedSpin: z.boolean(),
        proportionSpin: z.object({
          positive: z.number().nullish(),
          negative: z.number().nullish(),
        }),
        simulation: z.boolean(),
      }),
      data: z.array(
        z.object({
          averageEnergy: z.number(),
          averageMagnetization: z.number(),
          cycles: z.object({
            currentCycle: z.number(),
            totalCycles: z.number(),
          }),
          energy: z.number(),
          frames: z.object({
            savedFrames: z.number(),
            totalFrames: z.number(),
          }),
          magnetization: z.number(),
          sigmaEnergy: z.number().nullish(),
          sigmaMagnetization: z.number().nullish(),
          steps: z.number(),
          temperature: z.number(),
          totalEnergy: z.number(),
          totalMagnetization: z.number(),
        })
      ),
    }),
    resolve({ input }) {
      let link;
      let params = {
        Key: `${input.pathname}/${Date.now()}/data/data.json`,
        Bucket: BUCKET,
        Body: JSON.stringify(input),
      };
      try {
        s3.send(new PutObjectCommand(params));
      } catch (e) {
        console.log(e);
        link = "Error";
      }
      return {
        link: `https://${BUCKET}.s3.amazonaws.com${
          input.pathname
        }/${Date.now()}/data/data.json`,
      };
    },
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
