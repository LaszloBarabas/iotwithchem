'use strict';

let path = require('path');

const DbWs = require(path.resolve('backend/models/db-ws'));
const db = new DbWs();
/* Create new Message Queue  webservice -> pi*/

const MQueueWS = require(path.resolve('backend/communication/mqueue-ws'));

const Mail = require(path.resolve('backend/communication/mail'));
const mail = new Mail();

const ExcelExport = require(path.resolve('backend/models/excel-export'));
const excelExport = new ExcelExport(db);


module.exports = (app, passport, io) => {

  const mq = new MQueueWS(io);

  app.get('/getsensorids', checkAuthorization, (req, res) => {
    db.getTemperatureSensors((returndata) => {
      res.json(returndata)
    })
  });


  app.get('/gettemperature', (req, res) => {
    let sensorId;
    req.query.sensorid ? sensorId = req.query.sensorid : sensorId = '1';
    db.getTemperature(sensorId, (returndata) => {
      res.json(returndata)
    });
  });


  app.get('/gettempsbetween', checkAuthorization, (req, res) => {
    let sensorId;
    req.query.sensorid ? sensorId = req.query.sensorid : sensorId = '1';
    const dateFrom = req.query.datefrom;
    const dateTo = req.query.dateto;
    db.getTemperatureInterval(sensorId, dateFrom, dateTo, (returndata) => {
      res.json(returndata)
    });
  });

  app.get('/exporttempsbetween', checkAuthorization, (req, res) => {
    const dateFrom = req.query.datefrom;
    const dateTo = req.query.dateto;
    excelExport.exportTemps(dateFrom, dateTo, (report) => {
      res.setHeader('Content-disposition', `attachment; filename=temps-${new Date()}.xlsx`);
      res.setHeader('Content-type', 'application/vnd.ms-excel');
      return res.send(report);
    });
  });

  app.get('/getph', (req, res) => {
    let sensorId;
    req.query.sensorid ? sensorId = req.query.sensorid : sensorId = '1';
    db.getPh(sensorId, (returndata) => {
      res.json(returndata)
    })
  });


  app.get('/getphsbetween', checkAuthorization, (req, res) => {
    let sensorId;
    req.query.sensorid ? sensorId = req.query.sensorid : sensorId = '1';
    const dateFrom = req.query.datefrom;
    const dateTo = req.query.dateto;
    db.getPhInterval(sensorId, dateFrom, dateTo, (returndata) => {
      res.json(returndata)
    })
  });

  app.get('/exportphsbetween', checkAuthorization, (req, res) => {
    const dateFrom = req.query.datefrom;
    const dateTo = req.query.dateto;
    excelExport.exportPhs(dateFrom, dateTo, (report) => {
      res.setHeader('Content-disposition', `attachment; filename=temps-${new Date()}.xlsx`);
      res.setHeader('Content-type', 'application/vnd.ms-excel');
      return res.send(report);
    });
  });


  app.get('/getDeviceStatus', checkAuthorization, (req, res) => {
    mq.getDeviceStatus(status => {
      res.json({alive: status});
    })
  });

  app.get('/login/facebook',
    passport.authenticate('facebook', {scope: ['email']}));

  app.get('/login/facebook/return',
    passport.authenticate('facebook', {failureRedirect: '/login', scope: ['email']}),
    (req, res) => {
      res.redirect('/experiment')
    });


  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login')
  });

  app.get('/checkAuth', (req, res) => {
    req.isAuthenticated() ? res.json({'user': req.user.fb}) : res.json({'user': null});
  });

  app.post('/setheatertemperature', [checkAuthorization, logAction], (req, res) => {
    mq.sendMsgToRaspberry('Temp:Value:' + req.body.heatertemp);
    db.getJob((job) => {
      job.heaterValue = req.body.heatertemp;
      db.setJob(job, (newJob) => {
        res.json({sensorSetValue: newJob.heaterValue});
      });
    });
  });

  app.get('/getheatertemperature', checkAuthorization, (req, res) => {
    db.getJob((job) => {
      res.json({sensorSetValue: job.heaterValue});
    })
  });

  app.post('/settempuploadinterval', [checkAuthorization, logAction], (req, res) => {
    let upInterval;
    let sensorId;
    req.query.sensorid ? sensorId = req.query.sensorid : sensorId = '1';
    req.body.upinterval ? upInterval = req.body.upinterval : upInterval = '30000';
    mq.sendMsgToRaspberry('Temp:UpInterval:' + sensorId + ':' + upInterval);
    db.getJob((job) => {
      job.tempReadInt = upInterval;
      db.setJob(job, (newJob) => {
        res.json({sensorSetValue: newJob.tempReadInt});
      });
    });
  });


  app.post('/calibratephsensor', [checkAuthorization, logAction], (req, res) => {
    mq.sendMsgToRaspberry('Ph:Calibrate:' + req.body.level);
    res.json({sent: true})
  });

  app.post('/setphvalue', [checkAuthorization, logAction], (req, res) => {
    mq.sendMsgToRaspberry('Ph:Value:' + req.body.phValue);
    db.getJob((job) => {
      job.pumpValue = req.body.phValue;
      db.setJob(job, (newJob) => {
        res.json({sensorSetValue: newJob.pumpValue});
      });
    });
  });

  app.get('/getphvalue', checkAuthorization, (req, res) => {
    db.getJob((job) => {
      res.json({sensorSetValue: job.pumpValue});
    })
  });

  app.post('/setphuploadinterval', [checkAuthorization, logAction], (req, res) => {
    let upInterval;
    let sensorId;
    req.query.sensorid ? sensorId = req.query.sensorid : sensorId = '1';
    req.body.upinterval ? upInterval = req.body.upinterval : upInterval = '30000';
    mq.sendMsgToRaspberry('Ph:UpInterval:' + sensorId + ':' + upInterval);
    db.getJob((job) => {
      job.phReadInt = upInterval;
      db.setJob(job, (newJob) => {
        res.json({sensorSetValue: newJob.phReadInt});
      });
    });
  });

  app.get('/getOldestReadDates', checkAuthorization, (req, res) => {
    let sensorId;
    req.query.sensorid ? sensorId = req.query.sensorid : sensorId = '1';
    db.getOldestTemp(sensorId, (temp) => {
      db.getOldestPh(sensorId, (ph) => {
        res.json({temp: temp.tempdate, ph: ph.phdate});
      });
    });
  });

  app.get('/getJob', (req, res) => {
    db.getJob((job) => {
      res.json(job);
    })
  });

  app.post('/startjob', [checkAuthorization, logAction], (req, res) => {
    db.getJob(function (job) {
      if (job.jobEndDate > (new Date()).getTime()) {
        mq.sendMsgToRaspberry("Work:Stop");
      }
      setTimeout(() => {
        console.log('waiting to stop the previous job if there is any');
        db.getJob((job) => {
          job.jobStartDate = (new Date()).getTime();
          job.jobEndDate = req.body.jobEndDate;
          job.jobDescription = req.body.jobDescription;
          mq.sendMsgToRaspberry("Work:Start:" + (job.jobEndDate - job.jobStartDate) / 1000);
          db.setJob(job, (newJob) => {
            res.json(newJob);
          });
        });
      }, 4000);
    })
  });

  app.post('/stopjob', [checkAuthorization, logAction], (req, res) => {

    mq.sendMsgToRaspberry("Work:Stop");
    db.getJob(function (job) {
      if (job.jobEndDate > (new Date()).getTime()) {
        job.jobEndDate = (new Date()).getTime();
        db.setJob(job, (stoppedJob) => {
          res.json(stoppedJob);
        });
      } else {
        res.json(job);
      }
    });
  });

  app.post('/sendFeedback', checkAuthorization, (req, res) => {
    mail.sendMail(req.body.from, req.body.message);
    res.json({sent: true});
  });


  app.get('*', (req, res) => {
    res.sendFile(path.resolve('./dist/index.html'));
  })

};

function logAction(req, res, next) {
  //db.logAction(req.user.fb.name, req.originalUrl, (new Date()).toString());
  next();
}

function checkAuthorization(req, res, next) {
  next();
  // req.isAuthenticated() ? next() : res.sendFile(path.resolve('./dist/index.html'));
}
