// You can add general test setup code here
import dotenv from 'dotenv';

const res = dotenv.config({ path: './.env.test' });

if (res.error) {
  throw res.error;
}
