<template>
  <body>
    <div class="container-fluid container-main">
      <app-header></app-header>
      <div class="row mb-0 body-min-height" id="userSection">
        <div class="col-sm-2 login">
          <img src="./../assets/steemlogo.png" class="img-fluid" style="margin-bottom: 5px;">
          <span>
            <input type="text" v-model="username" v-on:keyup.enter="verifyUser" id="username" size="12" placeholder="@" style="margin:0px;">
            <button v-on:click="verifyUser" style="margin: margin:0px;">connect</button>
          </span>
        </div>
        <div class="col-sm-8">
          <div class="bannerBox" v-show="showUrls">
            <div class="urlsHeader">CURRENT HEADER</div>
            <draggable v-model="urls">
            <div v-for="(url, index) in urls" v-bind:key="index">
              <div>
                <div class="imgIcon">
                  <img v-bind:src="url.url" v-show="url.show" class="img-fluid img-thumbnail" @error="imageLoadError(url)" v-on:load="onLoad(url)">
                </div>
                <input type="text"  :key="index" v-model="url.url" placeholder="insert image url" data-toggle="tooltip" title="Insert Image URL" style="width: 80%;">
                <button type="button" v-on:click="addUrl" class="btn btn-secondary btn-sm" data-toggle="tooltip" title="Add Image URL">ADD</button>
                <button type="button" v-on:click="removeUrl(index)" class="btn btn-secondary btn-sm" v-if="index != 0" data-toggle="tooltip" title="Remove Image URL">REMOVE</button>
              </div>
            </div>
            </draggable>
          </div>
          <div id="status-section" v-show="true" v-cloak style="margin-left: 0px; margin-right: 0px; margin-top: 10px">
            <div v-show="showStatus" class="alert alert-success fade show">
              <button type="button" v-on:click="hideStatus" class="close">&times;</button>
              <strong>{{statusMsg}}</strong>.
            </div>
          </div>
          <div id="scheduler-section" v-show="showScheduler" v-cloak>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Every</span>
              </div>
              <input type="text"  v-model="frequency" name="freq" value="10" style="width: 35px">
              <select id="second" v-model="unity" class="frequency-select .input-lg" style="width: 80px">
                <option value="m">Minutes</option>
                <option value="h">Hours</option>
                <option value="d">Days</option>
              </select>
              <button type="button" class="btn btn-info btn-sm" style="margin-left: 10px;" v-on:click="confirmSchedule" v-bind:disabled="confirmDisabled" >Save Schedule</button>
                    <button type="button" class="btn btn-danger btn-sm" style="margin-left: 10px;" v-on:click="removeSchedule" v-show="showRemove">Remove Schedule</button>
            </div>
          </div>
        </div>
      </div>
      <app-footer></app-footer>
    </div>
  </body>
</template>

<script>
import Header from './../components/Header.vue'
import Footer from './../components/Footer.vue'
import steem from 'steem'
import axios from 'axios'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
    'app-header': Header,
    'app-footer': Footer
  },
  name: 'HelloWorld',
  data () {
    return {
      username: 'ivelton',
      statusMsg: 'none',
      showUrls: false,
      showScheduler: false,
      showRemove: false,
      showThumb: false,
      showStatus: false,
      unity: 'm',
      frequency: '10',
      urls: [],
      current_url: '',
      confirmDisabled: true,
      addDisabled: false
    }
  },
  methods: {
    // verify user on steem/db
    verifyUser: function () {
      this.urls = []
      this.showUrls = false
      this.showScheduler = false
      this.verifySteemUser(this.username)
    },
    // hide status message
    hideStatus: function () {
      this.showStatus = false
    },
    // add image url to urls collection
    addUrl: function () {
      this.urls.push({url: '', active: false, show: false})
      this.confirmDisabled = true
      this.addDisabled = true
    },
    // remove image url from urls collection
    removeUrl: function (urlindex) {
      this.urls.splice(urlindex, 1)
      // if (this.urls.length === 1) {
      this.confirmDisabled = false
      // }
      for (var u = 0; u < this.urls.length; u++) {
        this.urls[u].active = (u === 0)
      }
      this.setActiveUrl()
    },
    // set first url on collection to active
    setActiveUrl: function () {
      for (var i = 0; i < this.urls.length; i++) {
        this.urls[i].active = (i === 0)
      }
    },
    imageLoadError: function (url) {
      url.show = false
      this.confirmDisabled = true
      this.addDisabled = true
    },
    onLoad: function (url) {
      url.show = true
      this.confirmDisabled = false
      this.addDisabled = false
    },
    // save schedule to db
    confirmSchedule: function () {
      for (var x = 0; x < this.urls.length; x++) {
        if (this.urls[x].url === '') {
          this.statusMsg = 'Please fill image url info'
          this.showStatus = true
          return
        }
      }
      var user = this
      var obj = {}
      axios.get('http://localhost:3000/api/userbyname/' + this.username)
        .then(function (response) {
          if (response.data.length !== 0) {
            user.statusMsg = 'saving schedule'
            user.showStatus = true
            for (var u = 0; u < user.urls.length; u++) {
              user.urls[u].active = (u === 0)
            }
            obj = {
              'username': user.username,
              'unity': user.unity,
              'frequency': user.frequency,
              'urls': user.urls,
              'next_update': user.calcNextUpdate(user.unity, user.frequency)
            }
            axios.put('http://localhost:3000/api/users/' + response.data._id, obj)
              .then(function (response) {
                user.statusMsg = 'Schedule saved successfully'
                user.showStatus = true
                user.showRemove = true
              })
          } else {
            // user not in db
            user.statusMsg = 'Saving Schedule...'
            user.showStatus = true
            obj = {
              'username': user.username,
              'unity': user.unity,
              'frequency': user.frequency,
              'urls': user.urls,
              'next_update': user.calcNextUpdate(user.unity, user.frequency)
            }
            axios.post('http://localhost:3000/api/users', obj)
              .then(function (response) {
                user.statusMsg = 'Schedule saved successfully'
                user.showRemove = true
              })
          }
          // user.showUrls = false
          // user.showScheduler = false
          // user.showRemove = false
          // user.showThumb = false
        })
        .catch(function (error) {
          user.statusMsg = 'error:' + error
          user.showStatus = true
        })
    },
    // remove schedule from db
    removeSchedule: function () {
      let user = this
      axios.get('http://localhost:3000/api/userbyname/' + this.username)
        .then(function (response) {
          if (response.data.length !== 0) {
            user.statusMsg = 'removing schedule'
            user.showStatus = true
            axios.delete('http://localhost:3000/api/users/' + response.data._id)
              .then(function (response) {
                user.statusMsg = 'Schedule removed successfully'
                user.showUrls = false
                user.showScheduler = false
                user.showThumb = false
                user.confirmDisabled = true
                user.showRemove = false
                user.urls = []
                document.getElementById('username').focus()
              })
          }
        })
        .catch(function (error) {
          user.statusMsg = 'error:' + error
          user.showStatus = true
        })
    },
    // calculate iamge cover next update on db
    calcNextUpdate: function (unity, frequency) {
      var mult = 1
      switch (unity) {
        case 'm': mult = 60000; break
        case 'h': mult = 3600000; break
        case 'd': mult = 86400000; break
      }
      return new Date(Date.now() + (frequency * mult))
    },
    verifySteemUser: function (username) {
      let user = this
      steem.api.setOptions({ url: 'https://api.steemit.com/' })
      steem.api.getAccounts([username], function (err, response) {
        if (!err) {
          // verify if user is invalid
          if (!response.length > 0) {
            user.showThumb = false
            user.statusMsg = 'User does not exist on Steem'
            user.showStatus = true
            return
          }
          user.statusMsg = ''
          user.showStatus = false
          // get account metadata
          var account = response[0]
          var profile = JSON.parse(account.json_metadata).profile
          user.current_url = profile.cover_image
          user.showUrls = true
          user.showThumb = true
          user.showImageIcon = true
          user.showScheduler = true
          user.urls.push({url: user.current_url, active: true, show: true})
          // verify if user exists on db. if so, loads its data
          axios.get('http://localhost:3000/api/userbyname/' + username)
            .then(function (response) {
              if (response.data.length !== 0) {
                var urls = response.data.urls
                for (var i = 0; i < urls.length; i++) {
                  if (urls[i].url !== user.current_url) {
                    user.urls.push(urls[i])
                  }
                }
                user.unity = response.data.unity
                user.frequency = response.data.frequency
                user.showRemove = true
                // if (urls.length > 1) {
                user.confirmDisabled = false
                // }
              }
            })
        } else {
          // api call error
          user.statusMsg = 'error:' + err
          user.showStatus = true
        }
      })
    }
  }
}
</script>
