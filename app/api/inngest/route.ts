import { serve } from "inngest/next";
import { inngest } from "../../utils/inngest/client";
import {
  handleJobExpired,
  helloWorld,
  sendPeriodicJobNotification,
} from "./function";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, handleJobExpired, sendPeriodicJobNotification],
});
