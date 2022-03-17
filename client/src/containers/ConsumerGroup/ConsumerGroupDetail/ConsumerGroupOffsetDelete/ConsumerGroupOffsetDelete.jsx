import React from 'react';
import Header from '../../../Header/Header';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from '../../../../components/DatePicker';
import Joi from 'joi-browser';
import {
  uriConsumerGroup,
  uriConsumerGroupOffsetsByTimestamp, uriConsumerGroupTopics,
  uriConsumerGroupUpdate
} from '../../../../utils/endpoints';
import './styles.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import _ from 'lodash';

class ConsumerGroupOffsetDelete {
  state = {
    clusterId: '',
    consumerGroupId: '',
    topicIds: this.state.topicIds || [],
  };

  schema = {};

  componentDidMount() {
    const { clusterId, consumerGroupId } = this.props.match.params;

    this.setState({ clusterId, consumerGroupId }, () => {
      this.getTopics();
    });
  }

  async getTopics() {
    const { clusterId, consumerGroupId, topicIds} = this.state;

    let data = {};
    if (topicIds === []) {
      data = await this.getApi(uriConsumerGroup(clusterId, consumerGroupId));
      data = data.data;

      if (data) {
        this.setState({ topicIds: _.uniq(data.offsets.map(o => o.topic))});
      } else {
        this.setState({ topicIds: [] });
      }
    }
  }

  render() {
    const { consumerGroupId } = this.state;

    return (
      <div>
        <Header title={`Delete offsets: ${consumerGroupId}`} history={this.props.history} />
      </div>
    );
  }
}

export default ConsumerGroupOffsetDelete;
