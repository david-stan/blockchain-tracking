// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract AssetTracker {

  struct Asset {
    address manufacturer;
    string serial_number;
    uint creation_date;
    string description;
    string parent_serial;
  }

  mapping(string => Asset) public assets;
  mapping(string => address) public currentAssetOwner;

  event AssetCreated(address manufacturer, string serial_number, uint creation_date, string description, string parent_serial);
  event AssetTransfered(string serial_number, address indexed from, address indexed to, uint transfer_date, string description);

  function createAsset(string memory serial_number, uint creation_date, string memory description, string memory parent_serial) public {
    require(assets[serial_number].manufacturer == address(0), "Part ID already used");

    Asset memory new_asset = Asset(msg.sender, serial_number, creation_date, description, parent_serial);
    assets[serial_number] = new_asset;

    currentAssetOwner[serial_number] = msg.sender;

    emit AssetCreated(msg.sender, serial_number, creation_date, description, parent_serial);
  }

  function changeAssetOwnership(string memory serial_number, uint transfer_date, string memory description) public returns (bool) {
    require(assets[serial_number].manufacturer != address(0), "Asset does not exist.");
    require(currentAssetOwner[serial_number] != msg.sender, "Asset is owned by requester");

    address current_owner = currentAssetOwner[serial_number];
    currentAssetOwner[serial_number] = msg.sender;

    emit AssetTransfered(serial_number, current_owner, msg.sender, transfer_date, description);
  }

}
