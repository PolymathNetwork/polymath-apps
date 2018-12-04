import someStartupJob from './someStartupJob';

// Code that needs to run before we mount our components

export default async function startup() {
  Promise.all([someStartupJob()]);
}
