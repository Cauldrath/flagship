const childProcess = require('child_process');
const cocoapods = require(`../cocoapods`);
const fs = require(`fs-extra`);
const nodePath = require(`path`);
const os = require(`../os`);

const mockProjectDir = nodePath.join(__dirname, '..', '..', '..', '__tests__', `mock_project`);
const tempRootDir = nodePath.join(__dirname, `__cocoapods_test`);

jest.mock('child_process');
global.process.cwd = () => nodePath.resolve(tempRootDir);

beforeEach(() => {
  os.linux = false;
  fs.removeSync(tempRootDir);
  fs.copySync(mockProjectDir, tempRootDir);
});

afterEach(() => {
  fs.removeSync(tempRootDir);
});

test(`pod install`, () => {
  let stashedCmd = '';

  childProcess.execSync.mockImplementation((cmd: string) => stashedCmd = cmd);
  cocoapods.install();

  expect(stashedCmd).toMatch(`cd "${nodePath.join(tempRootDir, 'ios')}" && pod install`);
});

test(`pod install failing`, () => {
  let stashedCode = null;

  // @ts-ignore Allow function to return
  global.process.exit = (code?: number): never => { stashedCode = code; };
  childProcess.execSync.mockImplementation((cmd: string) => { throw new Error(''); });

  cocoapods.install();

  expect(stashedCode).toEqual(1);
});

test(`pod install on linux`, () => {
  let stashedCode: number | undefined | null = null;
  let stashedCmd: string | null = null;

  // @ts-ignore Allow function to return
  global.process.exit = (code?: number): never => { stashedCode = code; };
  childProcess.execSync.mockImplementation((cmd: string) => stashedCmd = cmd);

  os.linux = true;
  cocoapods.install();

  expect(stashedCode).toEqual(null);
  expect(stashedCmd).toEqual(null);
});

test(`add pod to podfile`, () => {
  cocoapods.add([
    'PODTEST1',
    'PODTEST2'
  ], nodePath.join(tempRootDir, `ios/Podfile`));

  const Podfile = fs
    .readFileSync(nodePath.join(tempRootDir, `ios/Podfile`))
    .toString();

  expect(Podfile).toMatch('PODTEST1');
  expect(Podfile).toMatch('PODTEST2');
});

test('add pod sources to podfile', () => {
  cocoapods.sources(['POD_SOURCE_1', 'POD_SOURCE_2']);
  const Podfile = fs
    .readFileSync(nodePath.join(tempRootDir, `ios/Podfile`))
    .toString();
  expect(Podfile).toMatch('POD_SOURCE_1');
  expect(Podfile).toMatch('POD_SOURCE_2');
});

// Force to be treated as a module
export {};
