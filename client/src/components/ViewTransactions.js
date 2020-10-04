import React, { useState, useEffect, useCallback } from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import * as ReactBootStrap from "react-bootstrap";
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function ViewTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previous, setPrevious] = useState(true);
  const [next, setNext] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");

  const getTransactionsData = async (page_num, filter) => {
    try {
      const response = await axios.get('http://localhost:3000/transactions?pagination=5&page=' + page_num + '&regex=' + filter);
      console.log(response);
      response.data.data.forEach((event) => {
        event.owner = formatAddress(event.owner);
        event.recipient = formatAddress(event.recipient);
        event.timestamp = formatTimestamp(new Date(event.timestamp * 1).toString());
      })
      setTransactions(response.data.data);
      setPrevious(response.data.previous);
      setNext(response.data.next);
    } catch (e) {
      console.log(e);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp) {
      return timestamp.split('(')[0]
    }
  }

  const formatAddress = (address) => {
    if (address) {
      const begin_slice = address.slice(0, 7);
      const end_slice = address.slice(address.length - 5, address.length);
      return begin_slice + '...' + end_slice;
    }
    return '-----------------';
  }

  const handleClick = useCallback((event) => {
    event.preventDefault();
    if (event.target.id === 'next') {
      setPage(page + 1);
      getTransactionsData(page + 1, filter);
    }
    if (event.target.id == 'prev') {
      setPage(page - 1);
      getTransactionsData(page - 1, filter);
    }
  })

  const handleFilter = useCallback((event) => {
    event.preventDefault();
    const filter = event.target.value;
    setFilter(filter);
    setPage(1);
    getTransactionsData(1, filter)
  })

  const columns = [
    { dataField: "timestamp", text: "Timestamp" },
    { dataField: "asset_serial", text: "Asset ID" },
    { dataField: "transaction_type", text: "Action" },
    { dataField: "owner", text: "Owner" },
    { dataField: "recipient", text: "Recipient" },
    { dataField: "description", text: "Description" },
  ]

  useEffect(() => {
    getTransactionsData(page, filter);
  }, []);

  return (
    <div style={viewStyle}>
      <Form className="form-style">
        <Form.Group className="form-group" controlId="exampleForm.ControlInput1" onChange={handleFilter}>
          <Form.Label>Filter serial number:</Form.Label>
          <Form.Control type="text" placeholder="Serial number" />
        </Form.Group>
      </Form>
      <BootstrapTable
        keyField="_id"
        data={transactions}
        columns={columns}/>
      <nav>
        <ul className="pagination">
          { previous &&
            <li className="page-item">
              <a id="prev" href="!#" onClick={handleClick} className="page-link">{'<'}</a>
            </li>
          }
          <li className="page-item">
            <a id="page" href="!#" onClick={handleClick} className="page-link">{page}</a>
          </li>
          { next &&
            <li className="page-item">
              <a id="next" href="!#" onClick={handleClick} className="page-link">{'>'}</a>
            </li>
          }
        </ul>
      </nav>
    </div>
  )
}

const viewStyle = {
  width: "90%",
  margin: "auto"
}
