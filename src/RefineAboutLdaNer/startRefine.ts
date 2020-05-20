// tslint:disable-next-line: no-var-requires
const spawn = require('child_process').spawn;
const pythonProcess = spawn('python', ['./lemmatization.py']);

function start() {
  console.log('start() start');

  // TODO can not catch error from python.
  pythonProcess.stdout.on('data', data => {
    // Do something with the data returned from python script
    console.log('response', data.toString());


    // make POS of all sentences

    // lemmatize all sentences

  });
}

start();

console.log('process end');