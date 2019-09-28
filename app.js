// Storage Controller
const StorageCtrl = (function(){
    // Public methods
    return {
        storeITem: function(item) {
            let items;
            // Check if any items in localstorage
            if( localStorage.getItem('items') === null){
                items = [];
                // Push new Item
                items.push(item);
                // Set ls
                localStorage.setItem('items', JSON.stringify(items));
            }else {
                items = JSON.parse( localStorage.getItem('items') );

                // Push the new Item
                items.push(item);

                // reset ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            }else {
                items = JSON.parse( localStorage.getItem('items') );
            }
            return items;
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });

            // reset ls
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(id === item.id){
                    items.splice(index, 1);
                }
            });

            // reset ls
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const ItemCtrl = (function() {
    // Item Constructor
    const Item = function( id, name, calories ) {
        this.id       = id;
        this.name     = name;
        this.calories = calories;
    }

    // Data Structure / this.state.
    const data = {
        // items: [
        //     // {id: 0, name: 'Steak Dinner', calories: 1200},
        //     // {id: 1, name: 'Cookie', calories: 400},
        //     // {id: 2, name: 'Eggs', calories: 300}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public methods
    return {
        logData: function() {
            return data;
        },
        getItems: function() {
            return data.items;
        },
        addItem: function( name, calories ) {
            // create ID
            let ID;

            if( data.items.length > 0 ) {
                ID = data.items[ data.items.length - 1 ].id + 1;
            } else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt( calories );
            
            // Create new Item
            newItem = new Item( ID, name, calories );

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function( id ) {
            let found = null;

            // Loop through the items
            data.items.forEach(function(item) {
                if(item.id === id){
                    found = item;
                }
            });

            return found;
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        updateItem: function( name, calories ) {
            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    found = item;
                    item.name = name;
                    item.calories = calories;
                }
            });

            return found;
        },
        deleteItem: function(id) {
            // Get the ids
            ids = data.items.map(function(item){
                return item.id;
            });

            // Get the index
            const index = ids.indexOf(id);

            // Remove Item
            data.items.splice(index, 1);
        },
        clearAllItems: function() {
            data.items = [];
        },
        getTotalCalories: function() {
            let total = 0;

            // loop through items and add cals
            data.items.forEach(function(item){
                total += item.calories;
            });

            // set Total cal in data structure
            data.totalCalories = total;

            return data.totalCalories;
        }
    }
})();



// UI Controller
const UICtrl = (function() {
    const UISelectors = {
        itemList: "#item-list",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        clearBtn: ".clear-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories"
    }
     
    // Public Methods
    return {
        populateItemList: function(items) {
            let html = '';
            
            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>
                        </li>`;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        addListItem: function(item){
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';

            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;

            // Add html
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>`;
            // Insert Item 
            
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        getSelectors: function() {
            return UISelectors;
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            const {name, calories} = ItemCtrl.getCurrentItem();

            document.querySelector(UISelectors.itemNameInput).value = name;
            document.querySelector(UISelectors.itemCaloriesInput).value = calories;

            UICtrl.showEditState();
        },
        showTotalCalories: function( total ) {
            document.querySelector(UISelectors.totalCalories).textContent = total;
        },
        deleteListItem: function(id){
             const itemID = `#item-${id}`;

             const item = document.querySelector(itemID);

             item.remove();
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            })
        },
        clearEditState: function() {
            UICtrl.clearInput();

            
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
        },
        showEditState: function() {            
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
        }
    }
})();



// App Controller 
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
    // Load Event Listener
    const loadEventListeners = function() {
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add Item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click',itemUpdateSubmit);

        // Update btn click event
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdate );

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
        
        // Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }

    // Add item submit
    const itemAddSubmit = function(e) {
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();
        
        // Check for name and calories input
        if( input.name !== '' && input.calories !== '' ){
            // Add item to the list
            const newItem = ItemCtrl.addItem( input.name, input.calories );

            // Add item to UI Ctrl
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in localStorage
            StorageCtrl.storeITem(newItem);

            // Clear Fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Update item submit
    const itemUpdateSubmit = function(e) {
        if(e.target.classList.contains('edit-item')){
            // Get list item id (item-0, item-1, ...)
            const listId = e.target.parentNode.parentNode.id;

            // Break into an array
            const listIdArr = listId.split('-');

            // GEt the actual Id
            const id = parseInt( listIdArr[1] );

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // SEt current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add Item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    const itemUpdate = function(e) {
        // Get form input from UI Controller
        let {name, calories} = UICtrl.getItemInput();
        
        calories = parseInt( calories );
        // Add item to the list
        const updatedItem = ItemCtrl.updateItem( name, calories );

        // Fetch Items from data Structure
        const items = ItemCtrl.getItems();

        // Check if any items 
        if( items.length === 0 ){
            UICtrl.hideList();
        }else{
            // Populate list with items
            UICtrl.populateItemList(items);
        }

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        // Update local Storage
        StorageCtrl.updateItemStorage( updatedItem );

        UICtrl.clearEditState();

        // Clear Current Item
        ItemCtrl.setCurrentItem(null);
        
        e.preventDefault();
    }
    
    // Delete button event
    const itemDeleteSubmit = function(e) {
        // get current item id
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI 
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete from ls
        StorageCtrl.deleteItemFromStorage( currentItem.id );

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear item event
    const clearAllItemsClick = function(e) {
        // Delete All Items from data Struncture
        ItemCtrl.clearAllItems();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        // Remove from UI
        UICtrl.removeItems();

        // Clear from Local storage 
        StorageCtrl.clearItemsFromStorage();

        // Hide UL
        UICtrl.hideList();

        e.preventDefault();
    }
    // Public Methods
    return {
        init: function() {
            // Clear edit state / set initial set
            UICtrl.clearEditState();

            // Fetch Items from data Structure
            const items = ItemCtrl.getItems();

            // Check if any items 
            if( items.length === 0 ){
                UICtrl.hideList();
            }else {
                // Populate list with items
                UICtrl.populateItemList(items);
                
                // Get total calories
                const totalCalories = ItemCtrl.getTotalCalories();

                // Add total calories to the UI
                UICtrl.showTotalCalories(totalCalories);

            }

            // Load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

App.init();