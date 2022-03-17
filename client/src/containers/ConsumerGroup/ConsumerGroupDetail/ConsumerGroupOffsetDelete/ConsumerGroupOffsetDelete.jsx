import React from 'react';
import Header from '../../../Header/Header';
import {
  uriConsumerGroup,
} from '../../../../utils/endpoints';
import 'react-toastify/dist/ReactToastify.css';
import Root from "../../../../components/Root";
import Table from "../../../../components/Table";
import constants from "../../../../utils/constants";
import ConfirmModal from "../../../../components/Modal/ConfirmModal";

class ConsumerGroupOffsetDelete extends Root {
  state = {
    clusterId: '',
    consumerGroupId: '',
    topicIds: [],
    deleteAllOffsetsForTopic: '',
    showDeleteModal: false,
    deleteMessage: '',
  };

  schema = {};

  componentDidMount() {
    const {clusterId, consumerGroupId} = this.props.match.params;

    this.setState({clusterId, consumerGroupId}, () => {
      this.getTopics();
    });
  }

  async getTopics() {
    const {clusterId, consumerGroupId} = this.state;

    let data = {};
      data = await this.getApi(uriConsumerGroup(clusterId, consumerGroupId));
      data = data.data;

      if (data) {
        this.setState({topicIds: data.topics.map(topic => ({topic}))});
      } else {
        this.setState({topicIds: []});
      }
  }

  showDeleteModal = deleteMessage => {
    this.setState({ showDeleteModal: true, deleteMessage });
  };

  closeDeleteModal = () => {
    this.setState({ showDeleteModal: false, deleteMessage: '' });
  };

  handleOnDelete(topicId) {
    this.setState({ deleteAllOffsetsForTopic: topicId }, () => {
      this.showDeleteModal(
          <React.Fragment>
            Do you want to delete all offsets of topic: {<code>{topicId}</code>} ?
          </React.Fragment>
      );
    });
  }

  render() {
    const {consumerGroupId} = this.state;

    return (
        <div>
          <div>
            <Header title={`Delete offsets: ${consumerGroupId}`}
                    history={this.props.history}/>
          </div>
          <div>
            <Table
                history={this.props.history}
                columns={[
                  {
                    id: 'topic',
                    accessor: 'topic',
                    colName: 'Topic',
                    type: 'text',
                    sortable: true
                  },
                ]}
                data={this.state.topicIds}
                noContent={
                  <tr>
                    <td colSpan={3}>
                      <div className="alert alert-warning mb-0" role="alert">
                        No offsets found.
                      </div>
                    </td>
                  </tr>
                }
                onDelete={(row) => {
                  this.handleOnDelete(row.topic)
                }}
                actions={
                  [constants.TABLE_DELETE]
                }
            />
          </div>
          <ConfirmModal
              show={this.state.showDeleteModal}
              handleCancel={this.closeDeleteModal}
              handleConfirm={this.deleteDefinition}
              message={this.state.deleteMessage}
          />
        </div>
    );
  }
}

export default ConsumerGroupOffsetDelete;
