import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ExperimentComponent} from './experiment.component';
import {FormsModule} from '@angular/forms';
import {MessagesModule, ProgressBarModule} from 'primeng/primeng';
import {CountDown} from 'angular2-simple-countdown/lib/countdown';
import {JustgageModule} from 'angular2-justgage';
import {TempService} from '../../services/temp/temp.service';
import {PhService} from '../../services/ph/ph.service';
import {JobService} from '../../services/job/job.service';
import {DialogService} from '../../services/dialog/dialog.service';
import {DeviceService} from '../../services/device/device.service';
import {CustomMdModule} from '../../../custom-md/custom-md.module';
import {JobDO} from '../../models/job';
import {JobDateDO} from '../../models/job-date';


describe('ExperimentComponent', () => {
  let component: ExperimentComponent;
  let fixture: ComponentFixture<ExperimentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExperimentComponent, CountDown
      ],
      imports: [CustomMdModule, FormsModule, ProgressBarModule, JustgageModule, MessagesModule],
      providers: [TempService, PhService, JobService, DialogService, DeviceService]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    fixture = TestBed.createComponent(ExperimentComponent);
    component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  }));

  describe('setupJob (newJob, currentJob)', () => {
    it('should set the currentJob to newJob', () => {
      const newJob = new JobDO(200000, 200100, 'test', 25, 30, 7, 30);
      const currentJob = new JobDateDO(new Date(), new Date(), '', 0, 0, 0, 0);
      ExperimentComponent.setupJob(newJob, currentJob);
      expect(currentJob.jobStartDate.getTime()).toEqual(200000);
      expect(currentJob.jobEndDate.getTime()).toEqual(200100);
      expect(currentJob.jobDescription).toEqual('test');
      expect(currentJob.pumpValue).toEqual(7);
      expect(currentJob.heaterValue).toEqual(25);
      expect(currentJob.tempReadInt).toEqual(30);
      expect(currentJob.phReadInt).toEqual(30);
    });
  });

  describe('calculateProgBarValue ()', () => {
    it('should set to the bar value to 100%, and coundowndate to null if the job\'s end date is in the past', () => {
      component.currentJob = new JobDateDO(new Date(), new Date(), 'test', 0, 0, 0, 0);
      component.calculateProgBarValue();
      expect(component.progressBarValue).toEqual(100);
      expect(component.countdownDate).toBe(null);
    });

    it('should set to the bar value to ~50%, if one hour passed from a 2 hour job', () => {
      const now = new Date();
      let past = new Date();
      past.setHours(now.getHours() - 1);
      let future = new Date();
      future.setHours(now.getHours() + 1);

      component.currentJob = new JobDateDO(past, future, 'test', 0, 0, 0, 0);
      component.calculateProgBarValue();
      expect(component.progressBarValue).toBeCloseTo(50);
    });
  });

  describe('createTempGauge (target)', () => {
    it('should create a custom temp gauge with a target temperature', () => {
      const tempGauge = ExperimentComponent.createTempGauge(50);
      expect(tempGauge.min).toEqual(0);
      expect(tempGauge.max).toEqual(100);
      expect(tempGauge.decimals).toEqual(2);
      expect(tempGauge.customSectors[0].lo).toEqual(0);
      expect(tempGauge.customSectors[0].hi).toEqual(47);
      expect(tempGauge.customSectors[4].lo).toEqual(53);
      expect(tempGauge.customSectors[4].hi).toEqual(100);
    });
  });

  describe('createPhGauge (target)', () => {
    it('should create a custom ph gauge with a target ph', () => {
      const phGauge = ExperimentComponent.createPhGauge(7);
      expect(phGauge.min).toEqual(1);
      expect(phGauge.max).toEqual(14);
      expect(phGauge.decimals).toEqual(2);
      expect(phGauge.customSectors[0].lo).toEqual(1);
      expect(phGauge.customSectors[0].hi).toEqual(5);
      expect(phGauge.customSectors[4].lo).toEqual(9);
      expect(phGauge.customSectors[4].hi).toEqual(14);
    });
  });
});
