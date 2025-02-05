import { forwardRef, useMemo, useState } from 'react';
import {
    Cell,
    Column,
    ColumnResizer,
    Group,
    Table as ReactAriaTable,
    ResizableTableContainer,
    Row,
    TableBody,
    TableHeader,
} from 'react-aria-components';
import type {
    CellProps,
    ColumnProps,
    TableProps as ReactAriaTableProps,
    RowProps,
    SortDescriptor,
} from 'react-aria-components';

export type LocationData = {
    id: string;
    location: string;
    month: number;
    year: number;
    total: number;
};

const sortItems = (items: LocationData[], column: keyof LocationData, direction: 'ascending' | 'descending' = 'ascending') => {
    const compareValues = (a: LocationData, b: LocationData) => {
        // First compare the main sort column
        const aVal = a[column];
        const bVal = b[column];
        
        // Handle string comparison
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            const comparison = aVal.localeCompare(bVal);
            return direction === 'ascending' ? comparison : -comparison;
        }
        
        // Handle number comparison
        if (aVal < bVal) return direction === 'ascending' ? -1 : 1;
        if (aVal > bVal) return direction === 'ascending' ? 1 : -1;
        
        // If primary sort is equal, use location as secondary sort
        const locationCompare = a.location.localeCompare(b.location);
        if (locationCompare !== 0) return locationCompare;
        
        // If location is equal, use year as tertiary sort
        if (a.year !== b.year) return b.year - a.year;
        
        // If year is equal, use month as final sort
        return b.month - a.month;
    };

    return items.slice().sort(compareValues);
};

export type TableProps<T extends object> = Omit<ReactAriaTableProps, 'className'> & {
    items: T[];
};

export const Table = forwardRef<HTMLTableElement, TableProps<LocationData>>((props, ref) => {
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: 'location',
        direction: 'ascending',
    });

    const sortedItems = useMemo(() => {
        const items = [...props.items];
        const column = sortDescriptor.column as keyof LocationData;
        
        return items.sort((a, b) => {
            const first = a[column];
            const second = b[column];
            
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === 'ascending' ? cmp : -cmp;
        });
    }, [props.items, sortDescriptor.column, sortDescriptor.direction]);

    return (
        <ResizableTableContainer className="w-full overflow-auto max-h-[600px] relative shadow text-gray-600">
            <ReactAriaTable
                ref={ref}
                aria-label="Locations"
                selectionMode="multiple"
                selectionBehavior="replace"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                className="border-separate border-spacing-0">
                <TableHeader>
                    <LocationColumn id="location" allowsSorting isRowHeader>
                        Location
                    </LocationColumn>
                    <LocationColumn id="month" allowsSorting>
                        Month
                    </LocationColumn>
                    <LocationColumn id="year" allowsSorting>
                        Year
                    </LocationColumn>
                    <LocationColumn id="total" allowsSorting>
                        Total
                    </LocationColumn>
                </TableHeader>
                <TableBody items={sortedItems}>
                    {(item) => (
                        <LocationRow>
                            <LocationCell>{item.location}</LocationCell>
                            <LocationCell>{item.month}</LocationCell>
                            <LocationCell>{item.year}</LocationCell>
                            <LocationCell>{item.total}</LocationCell>
                        </LocationRow>
                    )}
                </TableBody>
            </ReactAriaTable>
        </ResizableTableContainer>
    );
});

const LocationColumn = (props: ColumnProps & { children: React.ReactNode }) => (
    <Column
        {...props}
        className="sticky top-0 p-0 border-0 border-b border-solid border-slate-300 bg-slate-50 font-bold text-left cursor-default whitespace-nowrap outline-none">
        {({ allowsSorting, sortDirection }) => (
            <div className="flex items-center pl-4 py-1">
                <Group
                    role="presentation"
                    tabIndex={-1}
                    className="flex flex-1 items-center overflow-hidden outline-none rounded focus-visible:ring-2 ring-slate-600">
                    <span className="flex-1 truncate">{props.children}</span>
                    {allowsSorting && (
                        <span
                            className={`ml-1 w-4 h-4 flex items-center justify-center transition ${
                                sortDirection === 'descending' ? 'rotate-180' : ''
                            }`}>
                        </span>
                    )}
                </Group>
                <ColumnResizer className="w-px px-[8px] py-1 h-5 bg-clip-content bg-slate-400 cursor-col-resize rounded resizing:bg-slate-800 resizing:w-[2px] resizing:pl-[7px] focus-visible:ring-2 ring-slate-600 ring-inset" />
            </div>
        )}
    </Column>
);

const LocationRow = <T extends object>(props: RowProps<T>) => (
    <Row
        {...props}
        className="even:bg-slate-50 selected:bg-slate-600 selected:text-white cursor-default group outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-600 focus-visible:-outline-offset-4 selected:focus-visible:outline-white"
    />
);

const LocationCell = (props: CellProps) => (
    <Cell
        {...props}
        className={`px-4 py-2 truncate text-left ${props.className} focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-600 focus-visible:-outline-offset-4 group-selected:focus-visible:outline-white`}
    />
);

// // import ArrowUpIcon from '@spectrum-icons/ui/ArrowUpSmall';
// import { forwardRef, useMemo, useState } from 'react';
// import {
//     Cell,
//     Column,
//     ColumnResizer,
//     Group,
//     Table as ReactAriaTable,
//     ResizableTableContainer,
//     Row,
//     TableBody,
//     TableHeader,
// } from 'react-aria-components';
// import type {
//     CellProps,
//     ColumnProps,
//     TableProps as ReactAriaTableProps,
//     RowProps,
//     SortDescriptor,
// } from 'react-aria-components';

// export type LocationData = {
//     location: string;
//     month: number;
//     year: number;
//     total: number;
// };

// export type TableProps<T extends object> = Omit<ReactAriaTableProps, 'className'> & {
//     items: T[];
// };

// export const Table = forwardRef<HTMLTableElement, TableProps<LocationData>>((props, ref) => {
//     const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
//         column: 'location',
//         direction: 'ascending',
//     });

//     const sortedItems = useMemo(() => {
//         return [...props.items].sort((a, b) => {
//             const column = sortDescriptor.column as keyof LocationData;
//             const first = a[column];
//             const second = b[column];
//             let cmp = first < second ? -1 : first > second ? 1 : 0;
//             if (sortDescriptor.direction === 'descending') {
//                 cmp *= -1;
//             }
//             return cmp;
//         });
//     }, [sortDescriptor, props.items]);

//     return (
//         <ResizableTableContainer className="w-full overflow-auto scroll-pt-[2.321rem] relative  shadow text-gray-600">
//             <ReactAriaTable
//                 ref={ref}
//                 aria-label="Locations"
//                 selectionMode="multiple"
//                 selectionBehavior="replace"
//                 sortDescriptor={sortDescriptor}
//                 onSortChange={setSortDescriptor}
//                 className="border-separate border-spacing-0">
//                 <TableHeader>
//                     <LocationColumn id="location" allowsSorting isRowHeader>
//                         Location
//                     </LocationColumn>
//                     <LocationColumn id="month" allowsSorting>
//                         Month
//                     </LocationColumn>
//                     <LocationColumn id="year" allowsSorting>
//                         Year
//                     </LocationColumn>
//                     <LocationColumn id="total" allowsSorting>
//                         Total
//                     </LocationColumn>
//                 </TableHeader>
//                 <TableBody items={sortedItems}>
//                     {(item) => (
//                         <LocationRow id={`${item.location}-${item.month}-${item.year}-${item.total}`}>
//                             <LocationCell>{item.location}</LocationCell>
//                             <LocationCell>{item.month}</LocationCell>
//                             <LocationCell>{item.year}</LocationCell>
//                             <LocationCell>{item.total}</LocationCell>
//                         </LocationRow>
//                     )}
//                 </TableBody>
//             </ReactAriaTable>
//         </ResizableTableContainer>
//     );
// });

// const LocationColumn = (props: ColumnProps & { children: React.ReactNode }) => (
//     <Column
//         {...props}
//         className="sticky top-0 p-0 border-0 border-b border-solid border-slate-300 bg-slate-200 font-bold text-left cursor-default first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap outline-none">
//         {({ allowsSorting, sortDirection }) => (
//             <div className="flex items-center pl-4 py-1">
//                 <Group
//                     role="presentation"
//                     tabIndex={-1}
//                     className="flex flex-1 items-center overflow-hidden outline-none rounded focus-visible:ring-2 ring-slate-600">
//                     <span className="flex-1 truncate">{props.children}</span>
//                     {allowsSorting && (
//                         <span
//                             className={`ml-1 w-4 h-4 flex items-center justify-center transition ${
//                                 sortDirection === 'descending' ? 'rotate-180' : ''
//                             }`}>
//                             {/* {sortDirection && <ArrowUpIcon width={8} height={10} />} */}
//                         </span>
//                     )}
//                 </Group>
//                 <ColumnResizer className="w-px px-[8px] py-1 h-5 bg-clip-content bg-slate-400 cursor-col-resize rounded resizing:bg-slate-800 resizing:w-[2px] resizing:pl-[7px] focus-visible:ring-2 ring-slate-600 ring-inset" />
//             </div>
//         )}
//     </Column>
// );

// const LocationRow = <T extends object>(props: RowProps<T>) => (
//     <Row
//         {...props}
//         className="even:bg-slate-100 selected:bg-slate-600 selected:text-white cursor-default group outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-600 focus-visible:-outline-offset-4 selected:focus-visible:outline-white"
//     />
// );

// const LocationCell = (props: CellProps) => (
//     <Cell
//         {...props}
//         className={`px-4 py-2 truncate ${props.className} focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-600 focus-visible:-outline-offset-4 group-selected:focus-visible:outline-white`}
//     />
// );

// import { forwardRef } from 'react';
// import {
//     Cell,
//     Column,
//     Table as ReactAriaTable,
//     type TableProps as ReactAriaTableProps,
//     Row,
//     TableBody,
//     TableHeader,
// } from 'react-aria-components';

// // export const Table = () => {
// //     return <div className="bg-red-500">test</div>;
// // };

// export type TableProps<T extends object> = Omit<ReactAriaTableProps, 'className'> & {
//     test: string;
// };

// export const Table = forwardRef<HTMLTableElement, TableProps<object>>(({ test, ...props }, forwardedRef) => {
//     return (
//         <ReactAriaTable
//             {...props}
//             ref={forwardedRef}
//             className="border-separate border-spacing-0 min-w-full divide-y divide-gray-300">
//             <TableHeader>
//                 <Column>
//                     {/* <MyCheckbox slot="selection" /> */}
//                 </Column>
//                 <Column isRowHeader className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold whitespace-nowrap text-gray-900 sm:pl-0">Name</Column>
//                 <Column className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold whitespace-nowrap text-gray-900 sm:pl-0">Type</Column>
//                 <Column className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold whitespace-nowrap text-gray-900 sm:pl-0">Date Modified</Column>
//             </TableHeader>
//             <TableBody className="divide-y divide-gray-200 bg-white">
//                 <Row>
//                     <Cell>
//                         {/* <MyCheckbox slot="selection" /> */}
//                     </Cell>
//                     <Cell className="py-2 pr-3 pl-4 text-sm whitespace-nowrap text-gray-500 sm:pl-0">Games</Cell>
//                     <Cell>File folder</Cell>
//                     <Cell>6/7/2020</Cell>
//                 </Row>
//                 <Row>
//                     <Cell>
//                         {/* <MyCheckbox slot="selection" /> */}
//                     </Cell>
//                     <Cell>Program Files</Cell>
//                     <Cell>File folder</Cell>
//                     <Cell>4/7/2021</Cell>
//                 </Row>
//                 <Row>
//                     <Cell>
//                         {/* <MyCheckbox slot="selection" /> */}
//                     </Cell>
//                     <Cell>bootmgr</Cell>
//                     <Cell>System file</Cell>
//                     <Cell>11/20/2010</Cell>
//                 </Row>
//                 <Row>
//                     <Cell>
//                         {/* <MyCheckbox slot="selection" /> */}
//                     </Cell>
//                     <Cell>log.txt</Cell>
//                     <Cell>Text Document</Cell>
//                     <Cell>1/18/2016</Cell>
//                 </Row>
//             </TableBody>
//         </ReactAriaTable>
//     );
// });
