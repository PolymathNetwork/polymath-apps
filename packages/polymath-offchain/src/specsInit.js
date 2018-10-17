import dotenv from 'dotenv';

const res = dotenv.config({ path: '.env.test' });

// Override environment variables since we are in test mode and need to isolate them
process.env = {
  ...process.env,
  ...res.parsed,
};

if (res.error) {
  throw res.error;
}
