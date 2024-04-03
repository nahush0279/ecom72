import React from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function DataTableCom({ cols, actionBodyTemplate ,data }) {
    return (
        <div>
            <DataTable id='3'
            showGridlines rowHover paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} value={data} editMode="row" className='demodatatable' tableStyle={{ minWidth: '50rem'}}>
                {
                    cols.map((col, index) => (
                        <Column
                            id = {index}
                            key={index}
                            field={col.field}
                            header={col.header}
                            body = {col.body}
                            style={{ width: col.width || '20%' }}
                        ></Column>
                    ))
                }

                <Column header='Actions' body={actionBodyTemplate} width='20%' />
            </DataTable>
        </div>
    )
}
