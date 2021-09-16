/**
 *
 * Tests for TrackCard
 *
 */

import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { renderWithIntl, timeout } from '@utils/testUtils';
import TrackCard from '../index';
import testData from '../testData';
import { setIntl } from '@app/components/IntlGlobalProvider/index';
import customIntl from '@utils/customIntl';
import { BrowserRouter } from 'react-router-dom';

describe('<TrackCard />', () => {
  beforeAll(() => {
    setIntl(customIntl());
  });

  it('should render and match the snapshot', () => {
    const { baseElement } = renderWithIntl(
      <BrowserRouter>
        <TrackCard item={testData} />
      </BrowserRouter>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should contain 1 TrackCard component', () => {
    const { getAllByTestId } = renderWithIntl(
      <BrowserRouter>
        <TrackCard item={testData} />
      </BrowserRouter>
    );
    expect(getAllByTestId('track-card').length).toBe(1);
  });

  it('should work for play accordingly', async () => {
    const { getByTestId } = renderWithIntl(
      <BrowserRouter>
        <TrackCard item={testData} onPlay={jest.fn()} />
      </BrowserRouter>
    );
    fireEvent.click(getByTestId('play-button'));
    await timeout(500);
    expect(getByTestId('play-button')).toBeEnabled();
  });
  it('should render trackname & description', () => {
    const { getByTestId } = renderWithIntl(
      <BrowserRouter>
        <TrackCard item={testData} />
      </BrowserRouter>
    );
    expect(getByTestId('text-card')).toHaveTextContent(testData.trackName);

    expect(getByTestId('text-card')).toHaveTextContent(testData.artistName);
  });
});
