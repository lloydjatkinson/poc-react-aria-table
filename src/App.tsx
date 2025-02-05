import './App.css';
import { type LocationData, Table } from './Table';
import items from './data.json';


const mapLocationResult = (preprocessed: Omit<LocationData, 'id'>[]): LocationData[] =>
    preprocessed.map(location => ({
        ...location,
        id: `${location.location}-${location.month}-${location.year}`
    }))

export const App = () => {
    return <Table items={mapLocationResult(items.values as unknown as Omit<LocationData, 'id'>[])} />;
};
