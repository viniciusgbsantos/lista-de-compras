import React, { useEffect, useState } from 'react';
import { itemFetch } from '../src/services';

const ShoppingList = () => {
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');
  const [shoppingItems, setShoppingItems] = useState([]);
  const [check, setCheck] = useState(
    shoppingItems.map((post) => ({
      id: post.id,
      active: false
    }))
  )
  
  const getList = async () => {
    try {
      const response = await itemFetch.get('/items')
      const data = response.data;

      setShoppingItems(data);

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() =>{
    getList();
  }, []);
  
  const handleAddItem = async () => {
    if (title && quantity && unit && category) {
      const newItem = {
        title,
        quantity,
        unit,
        category,
      };
      try {
        const response = await itemFetch.post('/items', newItem);
        if (response.status === 200 || response.status === 201) {
          console.log('Item adicionado');
          getList(); 
          setTitle('');
          setQuantity('');
          setUnit('');
          setCategory('');
        } else {
          console.error('Falha ao adicionar o item. Status: ', response.status);
        }
      } catch (error) {
        console.error('Erro ao adicionar o item:', error.message);
      }
    }
  };
      

  function handleCheckItem(id) {
    try {
      const updatedCheck = check.map((post) => {
        if (post.id === id) {
          const updatedItem = { ...post, purchased: !post.purchased };
  
          itemFetch.put(`/items/${id}`, { purchased: updatedItem.purchased })
            .then(response => {
              if (response.status === 200 || response.status === 204) {
                console.log('Item marcado/desmarcado com sucesso na API!');
              } else {
                console.error('Falha ao marcar/desmarcar o item na API. Status:', response.status);
              }
            })
            .catch(error => {
              console.error('Erro ao marcar/desmarcar o item na API:', error.message);
            });
  
          return updatedItem;
        } else {
          return post;
        }
      });
  
      setCheck(updatedCheck);
    } catch (error) {
      console.error('Erro ao marcar/desmarcar o item:', error.message);
    }
  }

  const handleRemoveItem = async (index) => {

    try {
      const itemId = shoppingItems[index].id;
      const response = await itemFetch.delete(`/items/${itemId}`);
      
      if (response.status === 200 || response.status === 204) {
        console.log('Item removido');
        getList();
        setShoppingItems(response);

      }else{
        console.log('Falha ao remover o item. Status:', response.status)
      } 
    } catch (error) {
      console.error('Erro ao remover o item: ', error.message);
    }
  };

  return (
    <div className='container'>
      <h1>Lista de Compras</h1>
      <div className='form' >
        <label>Nome do Item:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className='quantidade'>
          <div>
            <label>Quantidade:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className='unidade'>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="kilo">Kilo</option>
              <option value="grama">Grama</option>
              <option value="unidade">Unidade</option>
            </select>
          </div>
        </div>
        <div className='categoria'>
        <label>Categoria:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Açougue">Açougue</option>
          <option value="Frios e laticínio">Frios e Laticínio</option>
          <option value="Adega e Bebidas">Adega e Bebidas</option>
          <option value="Higiene e Limpeza">Higiene e Limpeza</option>
          <option value="Hortifruti e Mercearia">Hortifruti e Mercearia</option>
          <option value="Padaria">Padaria</option>
          <option value="Enlatados">Enlatados</option>
          <option value="Cereais">Cereais</option>
          <option value="Rotisseria">Rotisseria</option>
        </select>
        <button className='btnadd' type="button" onClick={(e) => handleAddItem(e)}>
          Adicionar
        </button>
        </div>
      </div>
      <ul>
        {shoppingItems.map((post => (
          <li key={post.id}>
            <input
            className='check'
              type="checkbox"
              onChange={() => handleCheckItem(post.id)}
            />
            {post.title} - {post.quantity} - {post.unit} - {post.category}
            <button className='btnx' onClick={(e) => handleRemoveItem(post.id)}>X</button>
          </li>
        )))}
      </ul>
    </div>
  );
};

export default ShoppingList;
