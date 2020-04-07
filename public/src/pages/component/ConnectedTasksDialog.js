import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import CytoscapeComponent from 'react-cytoscapejs';

cytoscape.use(dagre);

class ConnectedTasksDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            graph: []
        };

        this.buildData = this.buildData.bind(this);
        this.buildDataRecur = this.buildDataRecur.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClickOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }

    componentWillMount() {
        this.buildData(this.props);
    }

    componentWillReceiveProps(next) {
        this.buildData(next);
    }

    buildData(props) {
        this.buildDataRecur(props, [], {}, {});
    }

    buildDataRecur(props, graph, drawnNodes, drawnEdges, startingNode=null) {
        let taskData = {};
        let currentId = -1;

        if (startingNode === null) {
            taskData = props.taskRef.data();
            currentId = props.taskRef.id;
            graph.push({
                data: {
                    id: props.taskRef.id,
                    label: taskData.title
                }
            });
            drawnNodes[currentId] = true;
        } else {
            taskData = startingNode.data;
            currentId = startingNode.id;
        }

        for (const dependency of taskData.dependencies) {
            //if (drawnNodes[dependency] === true || props.allTasksById[dependency] === undefined) {
            //    continue;
            //}
            graph.push({
                data: {
                    id: dependency,
                    label: props.allTasksById[dependency].data.title
                }
            });
            drawnNodes[dependency] = true;

            if (drawnEdges[dependency] !== undefined && drawnEdges[dependency][currentId] === true) {
                continue;
            }
            graph.push({
                data: {
                    source: dependency,
                    target: currentId,
                    label: ''
                }
            });
            if (drawnEdges[dependency] === undefined) {
                drawnEdges[dependency] = {};
            }
            drawnEdges[dependency][currentId] = true;
            this.buildDataRecur(props, graph, drawnNodes, drawnEdges, props.allTasksById[dependency]);
        }

        for (const dependent of taskData.dependents) {
            //if (drawnNodes[dependent] === true || props.allTasksById[dependent] === undefined) {
            //    continue;
            //}
            graph.push({
                data: {
                    id: dependent,
                    label: props.allTasksById[dependent].data.title
                }
            });
            drawnNodes[dependent] = true;

            if (drawnEdges[currentId] !== undefined && drawnEdges[currentId][dependent] === true) {
                continue;
            }
            graph.push({
                data: {
                    source: currentId,
                    target: dependent,
                    label: ''
                }
            })
            if (drawnEdges[currentId] === undefined) {
                drawnEdges[currentId] = {};
            }
            drawnEdges[currentId][dependent] = true;
            this.buildDataRecur(props, graph, drawnNodes, drawnEdges, props.allTasksById[dependent]);
        }
        this.setState({graph: graph});
    }

    render() {
        return (
            <React.Fragment>
                <Button onClick={this.handleClickOpen}>View connected tasks</Button>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby='form-dialog-title' fullWidth={true} maxWidth='lg'>
                    <DialogTitle id='form-dialog-title'>Connected tasks</DialogTitle>
                    <DialogContent>
                        <CytoscapeComponent
                            elements={this.state.graph}
                            layout={{
                                name: 'dagre',
                                spacingFactor: 4
                            }}
                            style={{ width: '100%', height: '700px', display: 'block' }}
                            minZoom={0.5}
                            maxZoom={2}
                            autoungrabify={true}
                            autoLock={true}
                            stylesheet={[ 
                                {
                                    selector: 'node',
                                    style: {
                                        'background-color': '#3F51B5',
                                        'height': '5px',
                                        'height': '5px',
                                        'shape': 'rectangle',
                                        'label': 'data(label)'
                                    }
                                },

                                {
                                    selector: 'edge',
                                    style: {
                                        'width': 1,
                                        'line-color': 'darkgray',
                                        'target-arrow-color': 'darkgray',
                                        'target-arrow-shape': 'triangle',
                                        'curve-style': 'bezier'
                                    }
                                }
                            ]}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default ConnectedTasksDialog;