const ChecklistItem = ({ index, updateItem, item }) => {

    function updateValue() {
        updateItem(index, !item.checked);
    }

  return (
    <div className="py-2">
      <input 
        name={item.name} 
        id={item.name}
        type="checkbox" 
        onChange={() => updateValue()} 
        checked={item.checked} 
        className="rounded mr-2" 
      />
      <label htmlFor={item.name}>{item.label}</label>
    </div>
  );
};

export default ChecklistItem;
