const spawn = require('child_process').spawn;
const pythonProcess = spawn('python', ['./hi.py']);

export function testFunction() {
  console.log('test1');
  pythonProcess.stdout.on('data', data => {
    // Do something with the data returned from python script
    console.log('!@#$%');
    console.log('response!@#$', data.toString());
  });
}

testFunction();