import { Report } from '@fabernovel/heart-core';

import Scan from '../src/api/model/Scan';
import ObservatoryModule from '../src/ObservatoryModule';


jest.mock('@fabernovel/heart-core');

describe('Starts an analysis', () => {
  const ANALYZE_URL = 'www.observatory.mozilla-test/results';
  const API_URL = 'www.observatory.mozilla-test/api';
  const SCAN: Scan = {
    end_time: '',
    grade: 'B',
    hidden: true,
    response_headers: {},
    scan_id: 1,
    score: 95,
    likelihood_indicator: '',
    start_time: '',
    state: 'FINISHED',
    tests_failed: 3,
    tests_passed: 4,
    tests_quantity: 12
  };

  beforeEach(() => {
    process.env.OBSERVATORY_ANALYZE_URL = ANALYZE_URL;
    process.env.OBSERVATORY_API_URL = API_URL;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@fabernovel/heart-core').__setMockScan(SCAN);
  });

  test('Starts an analysis with a valid configuration', async () => {
    const module = new ObservatoryModule({
      name: 'Heart Observatory Test',
      service: {
        name: 'Observatory Test'
      },
    });

    const REPORT = new Report({
      analyzedUrl: 'www.website.test',
      date: new Date(),
      note: SCAN.grade,
      resultUrl: ANALYZE_URL + 'www.website.test',
      service: {
        name: 'Observatory Test'
      },
      normalizedNote: SCAN.score > 100 ? 100 : SCAN.score
    });

    const report = await module.startAnalysis({ host: 'www.website.test' });

    expect(report).toStrictEqual(REPORT);
  });

  test('Starts an analysis with an invalid configuration', async () => {
    const module = new ObservatoryModule({
      name: 'Heart Observatory Test'
    });

    try {
      await module.startAnalysis({});
    } catch (e) {
      expect(e).toHaveProperty('error');
    }
  });
});

