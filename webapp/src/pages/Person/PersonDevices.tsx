import React, { useState, useEffect } from "react";
import { DeviceSummary } from "../../api/dto";
import { getDevicesByFilter } from "../../api";
import { Table, Spinner } from "react-bootstrap";
import { navigate } from "hookrouter";

interface PersonDevicesProps {
  id: number;
}

const PersonDevices: React.FunctionComponent<PersonDevicesProps> = ({ id }) => {
  const [devices, setDevices] = useState<DeviceSummary[] | undefined>(undefined);

  useEffect(() => {
    getDevicesByFilter(undefined, undefined, id, undefined)
      .then(d => setDevices(d))
      .catch(err => console.error(err));
  }, [id]);

  const onDeviceClick = (deviceId: number) => () => navigate(`/devices/${deviceId}`);

  const sortedDevices = devices
    ?.slice() // Do not modify the original list
    .sort((a, b) => (a.mac_address > b.mac_address ? 1 : -1)) // Initially sort by MAC address
    .sort((a, b) => {
      if (a.name === b.name) {
        return 0;
      } else if (a.name === "") {
        return 1;
      } else if (b.name === "") {
        return -1;
      } else {
        return a.name > b.name ? 1 : -1;
      }
    }); // Then sort by names (empty names are lowest)

  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>MAC Address</th>
            <th>Name</th>
            <th>Is Primary</th>
            <th>First Seen</th>
            <th>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {sortedDevices !== undefined &&
            sortedDevices.map(device => (
              <tr key={device.id} onClick={onDeviceClick(device.id)} className="pointer">
                <td className="mac-address">{device.mac_address}</td>
                <td>{device.name}</td>
                <td>{device.is_primary ? "✔️" : "❌"}</td>
                <td>{device.first_seen.toFormat("ff")}</td>
                <td>{device.last_seen.toRelative()}</td>
              </tr>
            ))}
        </tbody>
      </Table>

      {sortedDevices === undefined && (
        <div style={{ textAlign: "center" }}>
          <Spinner animation="border" />
        </div>
      )}
    </>
  );
};

export default PersonDevices;
