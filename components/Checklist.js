import { Fragment } from "react";
import ChecklistItem from "./ChecklistItem";

const Checklist = ({ items, updateItem }) => {
  return (
    <Fragment>
      <ul>
        {items.map((item, index) => {
          return <ChecklistItem item={item} key={index} index={index} updateItem={updateItem} />;
        })}
      </ul>
    </Fragment>
  );
};

export default Checklist;
