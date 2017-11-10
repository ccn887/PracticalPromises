'use strict';

var Promise = require('bluebird'),
    async = require('async'),
    exerciseUtils = require('./utils');

var readFile = exerciseUtils.readFile,
    promisifiedReadFile = exerciseUtils.promisifiedReadFile,
    blue = exerciseUtils.blue,
    magenta = exerciseUtils.magenta;

var args = process.argv.slice(2).map(function(st){ return st.toUpperCase(); });

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE
};

// runs every problem given as command-line argument to process
args.forEach(function(arg){
  var problem = module.exports['problem' + arg];
  if (problem) problem();
});

function problemA () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. log poem two stanza one and stanza two, in any order
   *    but log 'done' when both are done
   *    (ignore errors)
   *    note: reads are occurring in parallel (simultaneously)
   *
   */

  // callback version
  // async.each(['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'],
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- A. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- A. callback version done --');
  //   }
  // );
  promisifiedReadFile('poem-two/stanza-01.txt')
  .then(message => {
    blue(message)
  return promisifiedReadFile('poem-two/stanza-02.txt')
    .then(message => {return blue(message)})
    .then(message => {return console.log('done')})
    });

  // promise version
  // ???

}

function problemB () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. log all the stanzas in poem two, in any order
   *    and log 'done' when they're all done
   *    (ignore errors)
   *    note: reads are occurring in parallel (simultaneously)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
let promiseArr = filenames.map(function(files){
return promisifiedReadFile(files)
})
Promise.all(promiseArr)
.each(function(value){
  return blue(value)
})
.then(function(){return console.log('done')
});
// .each(function(value){
//   blue(value)
// })
  //promiseArr.then(message => {return console.log('done')})
  // callback version
  // async.each(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- B. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- B. callback version done --');
  //   }
  // );

  // promise version
  // ???

}

function problemC () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. read & log all the stanzas in poem two, *in order*
   *    and log 'done' when they're all done
   *    (ignore errors)
   *    note: reads are occurring in series (only when previous finishes)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
  let promiseArr = filenames.map(function(files){
    return promisifiedReadFile(files)
    })
    Promise.all(promiseArr)
    .each(function(value){
      return blue(value)
    })
    .then(function(){return console.log('done')
    });
  // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- C. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- C. callback version done --');
  //   }
  // );

  // promise version
  // ???

}

function problemD () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. log all the stanzas in poem two, *in order*
   *    making sure to fail for any error and log it out
   *    and log 'done' when they're all done
   *    note: reads are occurring in series (only when previous finishes)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
  var randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = 'wrong-file-name-' + (randIdx + 1) + '.txt';

  let promiseArr = filenames.map(function(files){
    return promisifiedReadFile(files)
    })
    //below could also do Promise.each(filenames, function(val) {
      //return promisifiedReadFile(val).then(blue)
    //})
    Promise.all(promiseArr)
    .each(function(value){
      return blue(value)
    })
    .then(function(){return console.log('done')
    })
    .catch(function(err){
      console.log(magenta(err))
      console.log('done');
    });
  // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- D. callback version --');
  //       if (err) return eachDone(err);
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     if (err) magenta(err);
  //     console.log('-- D. callback version done --');
  //   }
  // );

  // promise version
  // ???

}

function problemE () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. make a promisifed version of fs.writeFile
   *
   */

  var fs = require('fs');

  function promisifiedWriteFile(filename, str) {
    return new Promise(function(resolve, reject){
      fs.writeFile(filename, str, function(err){
        if (err) reject(err);
        else resolve(str);
    });
  });
}

// utils.promisifiedReadFile = function (filename) {
// 	return new Promise(function (resolve, reject) {
// 		utils.readFile(filename, function (err, str) {
// 			if (err) reject(err);
// 			else resolve(str);
// 		});
// 	});
// };
// utils.readFile = function (filename, callback) {
// 	var randExtraTime = Math.random() * 200;
// 	setTimeout(function () {
// 		fs.readFile(filename, function (err, buffer) {
// 			if (err) callback(err);
// 			else callback(null, buffer.toString());
// 		});
// 	}, randExtraTime);
};
