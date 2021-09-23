/**
 *
 * TrackDetail
 *
 */

import React, { useEffect, memo } from 'react';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { isEmpty } from 'lodash';
import { compose } from 'redux';
import { injectSaga } from 'redux-injectors';
import { connect } from 'react-redux';
import { Skeleton, Card, Avatar, Button, List } from 'antd';
import { PlayCircleTwoTone } from '@ant-design/icons';
import If from '@components/If';
import { T } from '@components/T';
import { colors } from '@app/themes';
import { itunesContainerCreators } from '../reducer';
import { selectItunesContainer, selectTrackData, selectTrackError } from '../selectors';
import itunesContainerSaga from '../saga';

const { Meta } = Card;

const Container = styled.div`
  && {
    display: flex;
    flex-wrap: wrap;
    max-width: ${(props) => props.maxwidth}px;
    padding: ${(props) => props.padding}px;
    width: 100%;
    margin: 0 auto;
  }
`;
const CustomCard = styled(Card)`
  && {
    padding: 20px;
    margin: 0 200px;
    width: 100%;
    border-radius: 10px;
    border: 5px solid ${colors.listcolor};
    height: 410px;
  }
`;
const ListContainer = styled.div`
  && {
    border-radius: 10px;
    border: 5px solid ${colors.listcolor};
    width: 30%;
    padding: 1.5em;
    height: inherit;
  }
`;
const StyledImage = styled.img`
  width: 18em;
  height: 18em;
`;
const CustomButtons = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em 5em;
`;
const CustomPlay = styled(PlayCircleTwoTone)`
  font-size: 2rem;
  padding: 1rem;
  cursor: pointer;
`;

export function TrackDetail({
  dispatchTrackData,
  dispatchClearTrackData,
  intl,
  trackDetails,
  trackError,
  maxwidth,
  padding
}) {
  const { trackId } = useParams();
  useEffect(() => {
    dispatchTrackData(trackId);
    return () => {
      dispatchClearTrackData();
    };
  }, []);
  const trackCard = () => {
    return (
      <CustomCard
        data-testid="track-details-card"
        style={{ width: 300 }}
        cover={<StyledImage data-testid="track-image" alt="example" src={trackDetails.artworkUrl100} />}
      >
        <Meta
          avatar={<Avatar src={trackDetails.artworkUrl30} />}
          title={trackDetails.trackName}
          description={trackDetails.artistName}
        />
        <CustomButtons shape="circle" icon={<CustomPlay />} />
      </CustomCard>
    );
  };
  const listCard = () => {
    return (
      <ListContainer>
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={trackDetails.artworkUrl30} />}
            title={trackDetails.collectionName}
            description={trackDetails.primaryGenreName}
          />
        </List.Item>
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={trackDetails.artworkUrl30} />}
            title={trackDetails.trackCensoredName}
            description={trackDetails.primaryGenreName}
          />
        </List.Item>
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={trackDetails.artworkUrl30} />}
            title={trackDetails.collectionName}
            description={trackDetails.primaryGenreName}
          />
        </List.Item>
        <List.Item data-testid="list-item">
          <List.Item.Meta
            avatar={<Avatar src={trackDetails.artworkUrl30} />}
            title={trackDetails.trackName}
            description={trackDetails.trackPrice}
          />
        </List.Item>
      </ListContainer>
    );
  };

  return (
    <Container maxwidth={maxwidth} padding={padding}>
      <If condition={isEmpty(trackError)} otherwise={<T id="something_went_wrong" />}>
        <Skeleton loading={isEmpty(trackDetails)} active>
          {trackCard()}
          {listCard()}
        </Skeleton>
      </If>
    </Container>
  );
}

TrackDetail.propTypes = {
  padding: PropTypes.number,
  intl: PropTypes.object,
  dispatchTrackData: PropTypes.func,
  dispatchClearTrackData: PropTypes.func,
  trackDetails: PropTypes.object,
  trackError: PropTypes.string,
  maxwidth: PropTypes.number
};

const mapStateToProps = createStructuredSelector({
  itunesContainer: selectItunesContainer(),
  trackDetails: selectTrackData(),
  trackError: selectTrackError()
});

export function mapDispatchToProps(dispatch) {
  const { requestGetTrackDetails, clearTrackDetails } = itunesContainerCreators;
  return {
    dispatchTrackData: (trackId) => dispatch(requestGetTrackDetails(trackId)),
    dispatchClearTrackData: () => dispatch(clearTrackDetails())
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo,
  injectSaga({ key: 'itunesContainer', saga: itunesContainerSaga })
)(TrackDetail);

export const TrackDetailTest = compose(injectIntl)(TrackDetail);
