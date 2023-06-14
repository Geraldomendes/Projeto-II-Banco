export default class Event {
  async register(maps, map) {
    let marker;

    function addMarker(location, map) {
      marker = new maps.Marker({
        map: map,
        position: location,
        draggable: true,
      });
    }

    map.addListener("click", (evt) => {
      if (marker) {
        marker.setMap(null);
        marker = undefined;
      }
      addMarker(evt.latLng, map);
    });

    document.getElementById("event-save").addEventListener("click", () => {
      const required = document.querySelector(".required-point");
      if (marker) {
        required.classList.add("hidden");
        this.save(marker.getPosition().lat(), marker.getPosition().lng());
      } else {
        required.classList.remove("hidden");
      }
    });
    this.showPoints(maps, map);
  }

  async save(lat, lng) {
    const obj = {
      titulo: document.getElementById("titulo").value,
      dataInicio: document.getElementById("dataInicio").value,
      dataFim: document.getElementById("dataFim").value,
      descricao: document.getElementById("descricao").value,
      lat,
      lng,
    };

    try {
      const response = await axios.post("http://localhost:3000/event", obj);
      response.status ? alert("Salvo com sucesso") : null;
      window.location.assign('/register.html');
    } catch (error) {
      alert("Erro ao salvar evento");
    }
  }

  async showPoints(maps, map) {
    try {
      const response = await axios.get("http://localhost:3000/event");
      const events = response.data;

      events.map((event) => {
        let infoWindow = new maps.InfoWindow();
        const latLng = new maps.LatLng(
          event.lat,
          event.lng
        );
        let marker;

        marker = new maps.Marker({
          position: latLng,
          map: map,
        });

        marker.addListener("click", () => {
          infoWindow.close();
          infoWindow.setContent(event.titulo);
          infoWindow.open(marker.getMap(), marker);
        });

        map.addListener("click", () => {
          infoWindow.close();
        });
      });
    } catch (error) {
      console.log(error);
      alert("Erro ao requisitar os dados");
    }
  }
  async show() {
    dayjs.extend(dayjs_plugin_utc);
    const response = await axios.get("http://localhost:3000/event");
    const events = response.data;

    const ul = document.getElementById("exibir");
    events.map((event) => {
      const li = document.createElement("li");
      const h3 = document.createElement("h3");
      const div = document.createElement("div");
      const pDataInicio = document.createElement("p");
      const pDataFim = document.createElement("p");
      const p = document.createElement("p");
      const editar = document.createElement("button");
      const deletar = document.createElement("button");

      ul.appendChild(li);
      li.setAttribute("id", "event__li");
      editar.setAttribute("id", "botaoEditar");
      deletar.setAttribute("id", "botaoDeletar");

      deletar.addEventListener('click', () => this.delete(`${event._id}`));
      editar.addEventListener('click', () => window.location.assign(`edit.html?id=${event._id}`));

      li.appendChild(h3);
      li.appendChild(div);
      div.appendChild(pDataInicio);
      div.appendChild(pDataFim);
      li.appendChild(p);
      li.appendChild(editar);
      li.appendChild(deletar);

      h3.textContent = event.titulo;
      pDataInicio.textContent = `Data Início: ${dayjs(event.dataInicio).utc().format('DD[/]MM[/]YYYY')}`;
      pDataFim.textContent = `Data Fim: ${dayjs(event.dataFim).utc().format('DD[/]MM[/]YYYY')}`;
      p.textContent = `Descrição: ${event.descricao}`;
      editar.textContent = 'Editar';
      deletar.textContent = 'Deletar';
    });

    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', () => {
      const content = document.getElementById('search-content');
      window.location.assign(`search.html?content=${content.value}`);
    })
  }

  async edit(maps, map){
    dayjs.extend(dayjs_plugin_utc);
    const url = new URLSearchParams(window.location.search);
    const id = url.get('id');

    const response = await axios.get(`http://localhost:3000/event/${id}`);
    const event = response.data;
    
    document.getElementById("titulo").value = event.titulo;
    document.getElementById("dataInicio").value = dayjs(event.dataInicio).utc().format('YYYY[-]MM[-]DD');
    document.getElementById("dataFim").value = dayjs(event.dataFim).utc().format('YYYY[-]MM[-]DD');
    document.getElementById("descricao").value = event.descricao;

    const latLng = new maps.LatLng(
      event.lat,
      event.lng
    );

    let marker = new maps.Marker({
      map: map,
      position: latLng,
      draggable: true,
    });

    document.getElementById("event-edit").addEventListener("click", () => {
      const required = document.querySelector(".required-point");
      if (marker) {
        required.classList.add("hidden");
        this.alter(marker.getPosition().lat(), marker.getPosition().lng(), id);
      } else {
        required.classList.remove("hidden");
      }
    });
  }

  async alter(lat, lng, id){
    const obj = {
      titulo: document.getElementById("titulo").value,
      dataInicio: document.getElementById("dataInicio").value,
      dataFim: document.getElementById("dataFim").value,
      descricao: document.getElementById("descricao").value,
      lat,
      lng,
    };

    try {
      const response = await axios.put(`http://localhost:3000/event/${id}`, obj);
      response.status ? alert("Atualizado com sucesso") : null;
      window.location.assign('register.html');
    } catch (error) {
      alert("Erro ao atualizar");
    }
  }

  async delete(id) {
    try {
      await axios.delete(`http://localhost:3000/event/${id}`);
      alert("O evento foi deletado.");
      window.location.reload();
    } catch (error) {
      alert("Ocorreu um erro ao deletar o evento.");
    }  
  }

  async search(maps, map){
    dayjs.extend(dayjs_plugin_utc);
    const url = new URLSearchParams(window.location.search);
    const content = url.get('content');

    const valueSearch = document.getElementById('value-search');
    valueSearch.textContent = `${valueSearch.textContent} ${content}`;

    const response = await axios.get(`http://localhost:3000/search/${content}`);
    const events = response.data;
    const ul = document.getElementById("ul-exibir");
    if(events.length > 0){
      events.map((event) => {
        const li = document.createElement("li");
        const h3 = document.createElement("h3");
        const div = document.createElement("div");
        const pDataInicio = document.createElement("p");
        const pDataFim = document.createElement("p");
        const p = document.createElement("p");
        const editar = document.createElement("button");
        const deletar = document.createElement("button");
  
        ul.appendChild(li);
        li.setAttribute("id", "event__li");
        editar.setAttribute("id", "botaoEditar");
        deletar.setAttribute("id", "botaoDeletar");
  
        deletar.addEventListener('click', () => this.delete(`${event._id}`));
        editar.addEventListener('click', () => window.location.assign(`edit.html?id=${event._id}`));
  
        li.appendChild(h3);
        li.appendChild(div);
        div.appendChild(pDataInicio);
        div.appendChild(pDataFim);
        li.appendChild(p);
        li.appendChild(editar);
        li.appendChild(deletar);
  
        h3.textContent = event.titulo;
        pDataInicio.textContent = `Data Início: ${dayjs(event.dataInicio).utc().format('DD[/]MM[/]YYYY')}`;
        pDataFim.textContent = `Data Fim: ${dayjs(event.dataFim).utc().format('DD[/]MM[/]YYYY')}`;
        p.textContent = `Descrição: ${event.descricao}`;
        editar.textContent = 'Editar';
        deletar.textContent = 'Deletar';
  
        const latLng = new maps.LatLng(
          event.lat,
          event.lng
        );
    
        let marker = new maps.Marker({
          map: map,
          position: latLng,
          draggable: true,
        });
      });
    }

    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', () => {
      const content = document.getElementById('search-content');
      window.location.assign(`search.html?content=${content.value}`);
    })
  }
}

const event = new Event();