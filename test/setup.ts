import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  // the code below will be executed before each test
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {
    // the db test.sqlite wasn't there. No issues for us.
  }
});
