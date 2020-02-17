import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import PropTypes from 'prop-types';
import { ActionCreators } from 'redux-undo';
import { updateSettings } from 'actions/SettingActions';
import ProLockedMessage from 'components/pro/ProLockedMessage';
import Constants from 'constants/Constants';
import { isPro } from 'selectors/AppSelectors';
import { isPublishing } from 'selectors/PublicationSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { getPublicationApp, getPublicationApps, getPublicationAppsById } from 'utils/PublicationUtils';

export function setPublishing(publishing) {
    return async dispatch => {
        dispatch({
            type: 'SET_PUBLISHING',
            publishing
        });
    };
}

export function setPublicationData(application, data) {
    return async dispatch => {
        dispatch({
            type: 'SET_PUBLICATION_DATA',
            application,
            data
        });
    };
}

export function getAccountInfo(appId) {
    return async dispatch => {
        const app = getPublicationApp(appId);

        if (!app) {
            throw new Error('No publication application defined');
        }

        await dispatch(app.getAccountInfo());
    };
}

export async function selectPublicationApps() {
    return new Promise(resolve => {
        let publicationApps = [];

        Modal.confirm({
            title: 'Select one or more publication service(s)',
            content: (
                <SelectPublicationApps
                    publicationApps={publicationApps}
                    onChange={apps => publicationApps = apps} />
            ),
            okText: 'Select',
            onOk: () => {
                resolve(publicationApps);
            },
            onCancel: () => {
                resolve(null);
            },
            width: 600
        });
    });
}

export function publish() {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            const settings = getSettings(state);

            if (!isPro(state)) {
                Modal.info({
                    icon: null,
                    width: 800,
                    content: (<ProLockedMessage />)
                });

                return;
            }

            if (isPublishing(state)) {
                return;
            }

            await dispatch(setPublishing(true));

            let { publicationApps } = settings;

            if (!publicationApps || publicationApps.length === 0) {
                publicationApps = await selectPublicationApps();

                if (!publicationApps) {
                    return;
                }

                await dispatch(updateSettings({
                    publicationApps
                }));
            }

            const apps = getPublicationAppsById(publicationApps);

            if (!apps || apps.length === 0) {
                message.warning('No publication application defined');
                return;
            }

            for (let app of apps) {
                await dispatch(app.publish());
            }
        } finally {
            await dispatch(ActionCreators.clearHistory());
            await dispatch(setPublishing(false));
        }
    };
}

function SelectPublicationApps({ publicationApps, onChange }) {
    const [selectedPublicationApps, setSelectedPublicationApps] = useState(publicationApps);

    return (
        <React.Fragment>
            {getPublicationApps().map(app => (
                <Button
                    key={app.id}
                    onClick={() => {
                        let apps = [...selectedPublicationApps];

                        if (apps.includes(app.id)) {
                            apps.splice(apps.indexOf(app.id), 1);
                        } else {
                            apps.push(app.id);
                        }

                        setSelectedPublicationApps(apps);
                        onChange(apps);
                    }}
                    style={{
                        width: 200,
                        height: 200,
                        margin: '0px 10px',
                        backgroundColor: selectedPublicationApps.includes(app.id) ? Constants.lightIconColor : null
                    }}>
                    <img
                        alt={app.label}
                        src={app.img}
                        style={{ width: 100, height: 100, marginBottom: 25 }} />
                    <br />
                    {app.label}
                </Button>
            ))}
        </React.Fragment>
    );
}

SelectPublicationApps.propTypes = {
    publicationApps: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    onChange: PropTypes.func.isRequired
};