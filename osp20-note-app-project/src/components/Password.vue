<template>
  <div>
    <v-container>
      <div class="dialog-div">
        <v-card solo="solo">
          <div class="dialog-div2">
            <v-row>
              <v-col cols="12">
                <span><v-card-title>Password</v-card-title></span>
                <span class="close" @click="closeDialog">
                  <i class="fas fa-times"></i>
                </span>
              </v-col>
            </v-row>
            <v-divider></v-divider>
          </div>
          <div class="password-div">
            <div style="text-align: -webkit-center">
              <v-row>
                <v-col cols="12">
                  <span>
                    <input
                      class="password-input2"
                      type="text"
                      max-size="100%"
                      v-model="password"
                      placeholder="Password"
                    />
                  </span>
                  <v-btn
                    text="text"
                    color="black"
                    class="write-btn"
                    @click="confirmPassword"
                    outlined="outlined"
                    >OK</v-btn
                  >
                  <br />
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </div>
          </div>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: "",
      password_dialog: true,
    };
  },
  methods: {
    closeDialog() {
      this.password_dialog = false;
      this.$emit("dialogClosed", this.password_dialog);
      //   window.location.reload();
    },
    confirmPassword() {},
  },
};
</script>

<style>
</style>