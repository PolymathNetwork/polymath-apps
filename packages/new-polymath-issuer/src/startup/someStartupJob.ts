// import someAsyncTask from './someAsyncTask';
// import someOtherTask from './someOtherTask';

const someAsyncTask = async () => {};
const someOtherTask = async () => {};

export default async function() {
  await Promise.all([await someAsyncTask(), await someOtherTask()]);
}
