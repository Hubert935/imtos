import React, { useEffect } from "react";
import { useAddTeamEvent, useTeamState } from "../../shared/api";
import { useState } from "react";
import { Spacer } from "../../ui-lib/Spacer/Spacer";
import {Divider} from "../../ui-lib/Divider/Divider";
import { Button } from "../../ui-lib/Button/Button";
import { working, emotions } from "../../shared/types"
import { Workers } from "./Workers";
import { set } from "lodash"
import Chat from "./Chat";
import styles from "./Project.module.css"
import { IconButton } from "../../ui-lib/IconButton/IconButton";

export const Project = () => {
    const addTeamEvent = useAddTeamEvent();
    const teamState = useTeamState();
    const [joke , setJoke] = useState(" ");

    const [eventType, setEventType] = useState(working[0]);
    const checkTrueOrFalse = () => {
        if (eventType == working[0]) {
            setEventType(working[1])
        } else {
            setEventType(working[0])
        }
    }

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

        
    function generateJOD() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Access the result here
            var jokeOfTheDay = this.response.toString().split("text")[1].split(":")[1].split("}}],")[0];
            console.log(jokeOfTheDay)
            setJoke(jokeOfTheDay);
            
            
        }
        };
        xhttp.open("GET", "https://api.jokes.one/jod?category=animal", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader("X-JokesOne-Api-Secret", "YOUR API HERE");
        xhttp.send();
        var array = xhttp.response
        console.log(array)
        console.log(xhttp)
    }

    return (
        <div className={styles.gridContainer}>
            <div className={styles.leftCol}>
                <Spacer size={32} />
                <Button
                    label={(eventType === working[1]) ? "Check out" : "Check in"}
                    onClick={async () => {
                        const result = await addTeamEvent(eventType);
                        const data = result?.data?.addTeamEvent.data;
                        checkTrueOrFalse()
                        console.log(`event ${eventType.id} is now ${data}`);
                    }}
                />
                <Spacer size={16} />
                <Divider/>
                <Spacer size={16} />
                <Workers />

            </div>
            <Chat />
            <div className={styles.rightCol}>

                <Spacer size={32} />
                <h3>How are you feeling?</h3>
                <Spacer size={16} />
                <div style={{display:"flex", flexDirection:"row"}}>
                <IconButton emoji={"😎"} onClick={
                        async () => {
                            const result = await addTeamEvent(emotions[0]);
                            const data = result?.data?.addTeamEvent.data;
                            console.log(`event ${emotions[0].id} is now ${data}`);
                        }
                    } />
                <IconButton emoji={"😖"} onClick={async () => {
                        const result = await addTeamEvent(emotions[1]);
                        const data = result?.data?.addTeamEvent.data;
                        console.log(`event ${emotions[1].id} is now ${data}`);
                    }}/>

                </div>
                <Spacer size={16} />
                <Divider/>
                <Spacer size={16} />
                <p>{teamState?.state.find((s) => s.key === "motion")?.value ?? "Unknown"}</p>
            <Spacer size={32} />
            <button onClick={generateJOD}>Hit me!</button>
            <p style={{color:"#ededed"}}>{joke}</p>
            </div>
        </div>
    )
}