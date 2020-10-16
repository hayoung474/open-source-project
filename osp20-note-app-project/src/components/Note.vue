<template>
    <v-card class="pa-5" elevation="3" :color="note.theme" style="width:100%;cursor: pointer;">
        <v-row>
            <v-col cols="10">
                <strong>{{ note.title }}</strong>
            </v-col>
            <v-col cols="1" v-if="note.important && !note.secret">
                <span class="importantonly">
                    <v-icon>mdi-pin</v-icon>
                </span>
            </v-col>
            <v-col cols="1" v-if="note.secret && !note.important">
                <span class="secretonly">
                    <i class="fas fa-lock"></i>
                </span>
            </v-col>
            <v-col cols="1" v-if="note.secret && note.important">
                <span class="importantsecret">
                    <span style="color: yellow">
                        <v-icon>mdi-pin</v-icon>
                    </span>
                    <span style="padding-left: 10px">
                        <i class="fas fa-lock"></i>
                    </span>
                </span>
            </v-col>
            <v-col cols="1">
                <span class="modify" @click.prevent="modifyNote(note,index)">
                    <i class="fas fa-edit"></i>
                </span>
            </v-col>
            <v-col cols="1">
                <span class="delete" @click.prevent="deleteNote(note,index)">
                    <i class="fas fa-times"></i>
                </span>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <p class="note-text" style="white-space: pre-line">
                    {{ note.text }}
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-spacer></v-spacer>
            <v-col cols="12" justify="end">
                <p class="text-right" style="margin-bottom: 0px !important; font-size: 13px">
                    {{ note.date }}
                </p>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    export default {
        props: {
            note: Object,
            index: Number
        },
        data() {
            return {
                modifyNote(note,index){
                    this.$emit('modifyNote',note,index);
                },
                deleteNote(note,index){
                    this.$emit('deleteNote',note,index);
                },
            }
        }
    }
</script>

<style></style>