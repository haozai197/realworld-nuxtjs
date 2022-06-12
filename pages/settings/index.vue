<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="setUser.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="setUser.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="setUser.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="setUser.email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="setUser.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button
                type="button"
                @click="update"
                class="btn btn-lg btn-primary pull-xs-right"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          <br />
          <button type="button" @click="logout" class="btn btn-outline-danger">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { updateSettings, getUser } from "@/api/user";
export default {
  middleware: "authenticated",
  name: "SettingsIndex",
  data() {
    return {
      setUser: {
        email: "",
        token: "",
        username: "",
        bio: "",
        image: "",
      },
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  mounted() {
    this.getUser();
  },
  methods: {
    async getUser() {
      const userRes = await getUser({ user: this.user });
      for (const key in userRes.data.user) {
        this.setUser[key] = userRes.data.user[key];
      }
    },
    async update() {
      const res = await updateSettings({ user: this.setUser });
      this.$store.commit('setUser', res.data.user)
      this.$router.push({
        name: "profile",
        params: {
          username: this.user.username,
        },
      });
    },
    getCookie(name) {
      let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
      if ((arr = document.cookie.match(reg))) {
        return true
      } else {
        return false
      }
    },
    logout() {
      let exp = new Date();
      exp.setTime(exp.getTime() - 1);
      let cval = this.getCookie("user");
      if (cval != null)
      document.cookie = "user" + "=" + cval + ";expires=" + exp.toGMTString();
      this.$store.commit("deleteUser");
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>
