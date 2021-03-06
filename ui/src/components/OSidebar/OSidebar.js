import {
  QExpansionItem,
  QItem,
  QItemSection,
  QIcon,
  QBadge,
  QList
} from 'quasar'

import './OSidebar.sass'
import Vue from "vue";

export default {
  name: 'OSidebar',
  watch: {
    $route (route) {
      this.showMenu(this.$refs[route.path])
    }
  },
  methods: {
    showMenu (comp) {
      if (comp !== void 0 && comp !== this) {
        this.showMenu(comp.$parent)
        comp.show !== void 0 && comp.show()
      }
    },
    getDrawerMenu (h, menu, path, level) {
      path = path[0] === '/' ? path.split('//')[0] : path
      if (menu.children !== void 0) {
        return h(
          QExpansionItem,
          {
            staticClass: 'non-selectable',
            ref: path,
            props: {
              label: menu.name,
              dense: level > 0,
              icon: menu.icon,
              defaultOpened: menu.opened,
              expandSeparator: true,
              switchToggleSide: level > 0,
              denseToggle: level > 0
            }
          },
          menu.children.map(item => this.getDrawerMenu(
            h,
            item,
            path + (item.path !== void 0 ? '/' + item.path : ''),
            level + 1
          ))
        )
      }

      const props = {
        to: path,
        dense: level > 0,
        insetLevel: level > 1 ? 1.2 : level
      }

      const attrs = {
        disabled: menu.disabled
      }

      if (menu.external === true) {
        Object.assign(props, {
          to: void 0,
          clickable: true,
          tag: 'a'
        })

        attrs.href = menu.path
        attrs.target = '_blank'
      }

      attrs.style = path !== this.$route.path ? 'color: black' : ''

      return h(QItem, {
        ref: path,
        props,
        attrs,
        staticClass: 'app-menu-entry non-selectable'
      }, [
        menu.icon !== void 0
          ? h(QItemSection, {
            props: { avatar: true }
          }, [ h(QIcon, { props: { name: menu.icon } }) ])
          : null,

        h(QItemSection, [ menu.name ]),

        menu.badge !== void 0
          ? h(QItemSection, {
            props: { side: true }
          }, [ h(QBadge, [ menu.badge ]) ])
          : null
      ])
    }
  },

  render (h) {
    return h(QList, { staticClass: 'app-menu' }, Vue.prototype.$oSidebarMenu.map(
      item => this.getDrawerMenu(h, item, item.disabled ? '' : '/' + item.path, 0)
    ))
  },

  mounted () {
    this.showMenu(this.$refs[this.$route.path])
  }
}
