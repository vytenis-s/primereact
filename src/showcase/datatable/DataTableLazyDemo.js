import React, { Component } from 'react';
import { DataTable } from '../../components/datatable/DataTable';
import { Column } from '../../components/column/Column';
import { CustomerService } from '../service/CustomerService';
import { TabView, TabPanel } from '../../components/tabview/TabView';
import { LiveEditor } from '../liveeditor/LiveEditor';
import { AppInlineHeader } from '../../AppInlineHeader';

export class DataTableLazyDemo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            first: 0,
            totalRecords: 0,
            customers: null
        };

        this.customerService = new CustomerService();
        this.onPage = this.onPage.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });

        setTimeout(() => {
            this.customerService.getCustomersLarge().then(data => {
                this.datasource = data;
                this.setState({
                    totalRecords: data.length,
                    customers: this.datasource.slice(0, 10),
                    loading: false
                });
            });
        }, 500);
    }

    onPage(event) {
        this.setState({ loading: true });

        //imitate delay of a backend call
        setTimeout(() => {
            const { first, rows } = event;

            this.setState({
                first,
                customers: this.datasource.slice(first, first + rows),
                loading: false
            });
        }, 500);
    }

    render() {
        return (
            <div>
                <div className="content-section introduction">
                    <AppInlineHeader changelogText="dataTable">
                        <h1>DataTable <span>Lazy</span></h1>
                        <p>Lazy mode is handy to deal with large datasets, instead of loading the entire data, small chunks of data is loaded by invoking corresponding callbacks everytime paging, sorting and filtering happens. Sample belows imitates
                            lazy paging by using an in memory list. It is also important to assign the logical number of rows to totalRecords by doing a projection query for paginator configuration so that paginator displays the UI assuming
                            there are actually records of totalRecords size although in reality they aren't as in lazy mode, only the records that are displayed on the current page exist.</p>
                    </AppInlineHeader>
                </div>

                <div className="content-section implementation">
                    <div className="card">
                        <DataTable value={this.state.customers} paginator rows={10} totalRecords={this.state.totalRecords}
                            lazy first={this.state.first} onPage={this.onPage} loading={this.state.loading}>
                            <Column field="name" header="Name"></Column>
                            <Column field="country.name" header="Country"></Column>
                            <Column field="company" header="Company"></Column>
                            <Column field="representative.name" header="Representative"></Column>
                        </DataTable>
                    </div>
                </div>

                <DataTableLazyDemoDoc></DataTableLazyDemoDoc>
            </div>
        );
    }
}

export class DataTableLazyDemoDoc extends Component {

    constructor(props) {
        super(props);

        this.sources = {
            'class': {
                tabName: 'Class Source',
                content: `
import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CustomerService } from '../service/CustomerService';

export class DataTableLazyDemo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            first: 0,
            totalRecords: 0,
            customers: null
        };

        this.customerService = new CustomerService();
        this.onPage = this.onPage.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });

        setTimeout(() => {
            this.customerService.getCustomersLarge().then(data => {
                this.datasource = data;
                this.setState({
                    totalRecords: data.length,
                    customers: this.datasource.slice(0, 10),
                    loading: false
                });
            });
        }, 500);
    }

    onPage(event) {
        this.setState({ loading: true });

        //imitate delay of a backend call
        setTimeout(() => {
            const { first, rows } = event;

            this.setState({
                first,
                customers: this.datasource.slice(first, first + rows),
                loading: false
            });
        }, 500);
    }

    render() {
        return (
            <div>
                <div className="card">
                    <DataTable value={this.state.customers} paginator rows={10} totalRecords={this.state.totalRecords}
                        lazy first={this.state.first} onPage={this.onPage} loading={this.state.loading}>
                        <Column field="name" header="Name"></Column>
                        <Column field="country.name" header="Country"></Column>
                        <Column field="company" header="Company"></Column>
                        <Column field="representative.name" header="Representative"></Column>
                    </DataTable>
                </div>
            </div>
        );
    }
}
                `
            },
            'hooks': {
                tabName: 'Hooks Source',
                content: `
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CustomerService } from '../service/CustomerService';

const DataTableLazyDemo = () => {
    const [loading, setLoading] = useState(false);
    const [first, setFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [customers, setCustomers] = useState(null);
    const datasource = useRef(null);
    const customerService = new CustomerService();

    useEffect(() => {
        setLoading(true);

        setTimeout(() => {
            customerService.getCustomersLarge().then(data => {
                datasource.current = data;
                setTotalRecords(data.length);
                setCustomers(datasource.slice(0, 10));
                setLoading(false);
            });
        }, 500);
    }

    const onPage = (event) => {
        setLoading(true);

        //imitate delay of a backend call
        setTimeout(() => {
            const { first:_first, rows } = event;

            setFirst(_first);
            setCustomers(datasource.current.slice(_first, _first + rows));
            setLoading(false);
        }, 500);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <div className="card">
                <DataTable value={customers} paginator rows={10} totalRecords={totalRecords}
                    lazy first={first} onPage={onPage} loading={loading}>
                    <Column field="name" header="Name"></Column>
                    <Column field="country.name" header="Country"></Column>
                    <Column field="company" header="Company"></Column>
                    <Column field="representative.name" header="Representative"></Column>
                </DataTable>
            </div>
        </div>
    );
}
                `
            },
            'ts': {
                tabName: 'TS Source',
                content: `
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CustomerService } from '../service/CustomerService';

const DataTableLazyDemo = () => {
    const [loading, setLoading] = useState(false);
    const [first, setFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [customers, setCustomers] = useState(null);
    const datasource = useRef(null);
    const customerService = new CustomerService();

    useEffect(() => {
        setLoading(true);

        setTimeout(() => {
            customerService.getCustomersLarge().then(data => {
                datasource.current = data;
                setTotalRecords(data.length);
                setCustomers(datasource.slice(0, 10));
                setLoading(false);
            });
        }, 500);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onPage = (event) => {
        setLoading(true);

        //imitate delay of a backend call
        setTimeout(() => {
            const { first:_first, rows } = event;

            setFirst(_first);
            setCustomers(datasource.current.slice(_first, _first + rows));
            setLoading(false);
        }, 500);
    }

    return (
        <div>
            <div className="card">
                <DataTable value={customers} paginator rows={10} totalRecords={totalRecords}
                    lazy first={first} onPage={onPage} loading={loading}>
                    <Column field="name" header="Name"></Column>
                    <Column field="country.name" header="Country"></Column>
                    <Column field="company" header="Company"></Column>
                    <Column field="representative.name" header="Representative"></Column>
                </DataTable>
            </div>
        </div>
    );
}
                `
            }
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <div className="content-section documentation">
                <TabView>
                    <TabPanel header="Source">
                        <LiveEditor name="DataTableLazyDemo" sources={this.sources} service="CustomerService" data="customers-large" />
                    </TabPanel>
                </TabView>
            </div>
        )
    }
}
