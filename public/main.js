let houses = [];

const socket = new WebSocket(`ws://${location.hostname}:8001`);
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
    );
  },
}

const Menu = {
  view: function(vnode) {
    return m('div', { class: 'menu' }, vnode.attrs.houses.map(house => {
      const { name, score, colors } = house;
      return m('div', { class: 'group' },
        m('p', { style: `color: ${colors[0]}` }, `${name}: ${score}`),
        m('button', { class: 'give-point', onclick: () => changePoints(name, 1) }, 'Give Point'),
        m('button', { class: 'take-point', onclick: () => changePoints(name, -1) }, 'Take Point'),
      );
    }));
  },
}

const App = {
  view: function(vnode) {
    const { houses } = vnode.attrs;
    if (location.hash === '#menu') {
      return m(Menu, { houses });
    } else {
      return m('div', { class: 'tv' },
        m('div', { class: 'houses' }, houses.map(house => m(House, { house }))),
      );
    }
  },
}

m.mount(document.getElementById('root'), { view: () => m(App, { houses }) });
