let houses = [];
let showMenu = false;

const socket = new WebSocket('ws://localhost:8001');
socket.addEventListener('message', event => {
  houses = JSON.parse(event.data);
  m.redraw();
});

function changePoints(house, delta) {
  socket.send(`changePoints ${house} ${delta}`);
}

const House = {
  view: function(vnode) {
    const { name, score, colors } = vnode.attrs.house;
    const barStyle = `
      background-color: ${colors[0]};
      height: ${score * 10}px;
    `;
    return m('div', { class: 'house', style: `color: ${colors[0]}` },
      m('div', { class: 'bar', style: barStyle }),
      m('h1', name),
      m('h2', score),
      m('button', { onclick: () => changePoints(name, -1) }, 'Take Point'),
      m('button', { onclick: () => changePoints(name, 1) }, 'Give Point'),
    );
  },
}

const Menu = {
  view: function(vnode) {
    return showMenu && m('div', { class: 'menu' }, vnode.attrs.houses.map(house => {
      return m('p', house.name);
    }));
  },
}

const App = {
  view: function(vnode) {
    return m('div', {},
      m('button', { onclick: () => showMenu = !showMenu }, 'Toggle Menu'),
      m(Menu, { houses: vnode.attrs.houses }),
      m('div', { class: 'houses' }, vnode.attrs.houses.map(house => m(House, { house }))),
    );
  },
}

m.mount(document.getElementById('root'), { view: () => m(App, { houses }) });
