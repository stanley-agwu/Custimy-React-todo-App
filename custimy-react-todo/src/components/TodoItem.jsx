import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

const StyledTodoItem = styled.li`
  display: flex;
  padding: 15px 0;

  button {
    background: ${({ theme }) => theme.lightGrey};
    border: 0;
    border-radius: 4px 4px 0 0;
    margin-right: 15px;
    padding: 10px;
    cursor: pointer;

    .fa-circle {
      font-size: 16px;
      color: ${({ theme }) => theme.darkerGrey};
    }

    .fa-check-circle {
      color: ${({ theme }) => theme.darkestGrey};
      font-size: 16px;
      display: none;
    }

    &:hover {
      background: ${({ theme }) => theme.darkerGrey};
      transition: 0.3s;

      .fa-circle {
        transition: 0.3s;
        display: none;
      }

      .fa-check-circle {
        display: inline-block;
      }
    }
  }

  input {
    font-size: 16px;
    color: ${({ theme }) => theme.darkestGrey};
    align-self: center;
    width: 100%;
    border: none;
    outline: none;
    background: ${({ theme }) => theme.backgroundColor};
    text-decoration: ${({ expiredTodoStyle }) => expiredTodoStyle >= 0 ? 'none' : 'line-through'};;
  }

  .main {
    display: flex;
    width: 60%;
    border-bottom: 2px solid ${({ theme }) => theme.lightGrey};

    &:hover {
      border-color: ${({ theme }) => theme.darkerGrey};
      transition: 0.3s;

      button {
        background: ${({ theme }) => theme.darkerGrey};
        transition: 0.3s;
      }

      .fa-circle {
        color: ${({ theme }) => theme.lightGrey};
        transition: 0.3s;
      }
    }

    @media (max-width: 767px) {
      width: 100%;
    }
  }
  .features {
    width: 40%;
    display: flex;

    @media (max-width: 767px) {
      width: 100%;
      margin-top: 10px;
      justify-content: flex-end;
    }
  }
  .fa-exclamation {
    display: ${({ item }) => item.priority === 'URGENT' ? 'inline' : 'none'};
    font-size: 24px;
    font-weight: 600;
    color: ${({ theme }) => theme.normalRed};
    cursor: pointer;
  }

  .due-date {
    display: flex;
    font-size: 12px;
    margin: 0 10px;
    width: fit-content;
    padding: 15px;
    border-radius: 15px;
    background-color: ${({ theme }) => theme.OtherRed};
    align-items: center;
    justify-content: center;
  }
  .priority {
    display: flex;
    font-size: 12px;
    margin: 0 10px;
    width: fit-content;
    border-radius: 15px;
    padding: 15px;
    background-color: ${({ item, theme }) => {
      if (item.priority === 'URGENT') return theme.lightRed
      if (item.priority === 'IMPORTANT') return theme.green
      if (item.priority === 'SECONDARY') return theme.blue
      if (item.priority === 'PRIMARY') return theme.lightBlue
      return null
    }};
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

const TodoItem = ({ deleteItem, item, editItem }) => {
  const [value, setValue] = useState(item.todo || '');

  const editHandler = useCallback(
    debounce(async (originalItem, editedItemValue) => {
      await editItem(originalItem, editedItemValue);
    }, 500),
    [],
  );

  useEffect(() => {
    if (value !== item.todo) {
      editHandler(item, value);
    }
  }, [item, value]);

  const daysDiff = (date) => {
    const today = new Date()
    const selectedDate = new Date(date)
    const millsecondPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((selectedDate.getTime() - today.getTime()) / millsecondPerDay)
  }

  const expiredTodoStyle = daysDiff(item.dueDate)

  return (
    <StyledTodoItem item={item} expiredTodoStyle={expiredTodoStyle}>
      <div className="main">
        <button type="button" onClick={() => deleteItem(item)}>
          <FontAwesomeIcon className="fa-circle" icon={faCircle} />
          <FontAwesomeIcon className="fa-check-circle" icon={faCheckCircle} />
        </button>
        <input
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            editHandler();
          }}
        />
      </div>
      <div className="features">
        <span className="due-date">{item.dueDate.split('-').reverse().join('/')}</span>
        <span className="priority">{item.priority}</span>
        <FontAwesomeIcon className="fa-exclamation tooltip" icon={faExclamation}>
          <span className="tooltiptext">ASAP.</span>
        </FontAwesomeIcon>
      </div>
    </StyledTodoItem>
  );
};

TodoItem.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  item: PropTypes.shape({
    identifierKey: PropTypes.string,
    todo: PropTypes.string,
    dueDate: PropTypes.string,
    priority: PropTypes.string
  }).isRequired,
};

export default TodoItem;
