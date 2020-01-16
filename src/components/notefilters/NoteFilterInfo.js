import React from 'react';
import { Alert, Divider, Empty } from 'antd';
import FilterConditionTree from 'components/filters/FilterConditionTree';
import FilterForm from 'components/filters/FilterForm';
import SorterTable from 'components/filters/SorterTable';
import { getNoteSorterFields } from 'data/DataNoteSorterFields';
import { useNoteFieldApi } from 'hooks/UseNoteFieldApi';
import { NoteFilterPropType } from 'proptypes/NoteFilterPropTypes';

function NoteFilterInfo({ noteFilter }) {
    const noteFieldApi = useNoteFieldApi();

    if (!noteFilter) {
        return (<Empty />);
    }

    return (
        <React.Fragment>
            <Alert
                type="info"
                message="The general filters are read only."
                showIcon
                style={{ marginBottom: 10 }} />
            <FilterForm
                filter={noteFilter}
                disabled={true} />
            <Divider>Filters</Divider>
            <FilterConditionTree
                filter={noteFilter}
                context={{
                    fields: noteFieldApi.noteFields
                }}
                disabled={true} />
            <Divider>Sorters</Divider>
            <SorterTable
                sorters={noteFilter.sorters || []}
                sorterFields={getNoteSorterFields()}
                orderSettingPrefix="noteSorterColumnOrder_"
                widthSettingPrefix="noteSorterColumnWidth_"
                disabled={true} />
        </React.Fragment>
    );
}

NoteFilterInfo.propTypes = {
    noteFilter: NoteFilterPropType
};

export default NoteFilterInfo;