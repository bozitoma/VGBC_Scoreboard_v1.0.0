import {FC, useState} from "react";
import { TextField, Button, Stack, Container,Alert } from "@mui/material";
import { Update as UpdateIcon } from '@mui/icons-material'; // アイコンのインポート
import DataObjectIcon from '@mui/icons-material/DataObject';
// import { useReplicant } from "../../../use-replicant";
import { fetchDataFromAPI,transformApiResponseToScoreboard } from '../../libs/apiFunctions';
import { Scoreboard } from "../../../../nodecg/generated/scoreboard";


export const Sample: FC = () => {
    const [scoreboard_input, setscoreboard_input] = useState<Scoreboard>({
        player1_name: '',
        player1_prefix: '',
        player1_score: 0,
        player2_name: '',
        player2_prefix: '',
        player2_score: 0,
        fullRoundText:''
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const updateScoreboard = (scoreboard_input:Scoreboard) => {
		nodecg.sendMessage("scoreboard:update", scoreboard_input)
    }

    const handleFetchData = async () => {
        const data = await fetchDataFromAPI();
    
        if (data) {
            const newScoreboard = transformApiResponseToScoreboard(data);
    
            if ('error' in newScoreboard) {
                // エラーメッセージを設定
                setErrorMessage(newScoreboard.message);
            } else {
                // Scoreboardデータを更新
                setscoreboard_input(newScoreboard);
                // エラーメッセージをクリア
                setErrorMessage(null);
            }
        } else {
            // APIからのデータがない場合のエラーメッセージ
            setErrorMessage("APIからのデータが取得できませんでした。");
        }
    }
    
    


    return (
        <Container maxWidth="sm" sx={{ p: 2 }}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <Stack spacing={3}>

                {/* Roundの配置 */}
                <Stack spacing={2} direction='row'>
                <TextField 
                    id="fullRoundText" 
                    label="fullRoundText" 
                    variant="outlined" 
                    value={scoreboard_input.fullRoundText} 
                    onChange={(e)=>{setscoreboard_input(prev => ({...prev, fullRoundText: e.target.value}))}}
                />
                <TextField 
                    id="player1_prefix" 
                    label="player1_prefix" 
                    variant="outlined" 
                    value={scoreboard_input.player1_prefix} 
                    onChange={(e)=>{setscoreboard_input(prev => ({...prev, player1_prefix: e.target.value}))}}
                    />
                </Stack>

                <Stack spacing={2} direction='row'>
                    <Stack spacing={1}>
                    {/* 1Pのフィールド */}
                        <TextField 
                            id="player1_prefix" 
                            label="player1_prefix" 
                            variant="outlined" 
                            value={scoreboard_input.player1_prefix} 
                            onChange={(e)=>{setscoreboard_input(prev => ({...prev, player1_prefix: e.target.value}))}}
                            />
                        <TextField 
                            id="player1_name" 
                            label="player1_name" 
                            variant="outlined" 
                            value={scoreboard_input.player1_name} 
                            onChange={(e)=>{setscoreboard_input(prev => ({...prev, player1_name: e.target.value}))}}
                            />
                        <TextField 
                            id="player1_score" 
                            type="number" 
                            label="player1_score" 
                            variant="outlined" 
                            value={scoreboard_input.player1_score} 
                            onChange={(e) => {setscoreboard_input(prev => ({ ...prev, player1_score: Number(e.target.value) }))}}
                            />
                    </Stack>

                    {/* 2Pのフィールド */}
                    <Stack spacing={1}>
                        <TextField 
                            id="player2_prefix" 
                            label="player2_prefix" 
                            variant="outlined" 
                            value={scoreboard_input.player2_prefix} 
                            onChange={(e)=>{setscoreboard_input(prev => ({...prev, player2_prefix: e.target.value}))}}
                            />
                        <TextField 
                            id="player2_name" 
                            label="player2_name" 
                            variant="outlined" 
                            value={scoreboard_input.player2_name} 
                            onChange={(e)=>{setscoreboard_input(prev => ({...prev, player2_name: e.target.value}))}}
                            />
                        <TextField 
                            id="player2_score" 
                            type="number" 
                            label="player2_score" 
                            variant="outlined" 
                            value={scoreboard_input.player2_score} 
                            onChange={(e) => {setscoreboard_input(prev => ({ ...prev, player2_score: Number(e.target.value) }))}}
                            />
                    </Stack>
                </Stack>

                {/* UPDATEボタン */}
                <Stack spacing={2} direction='row'>
                    <Button 
                    variant="contained" 
                    startIcon={<DataObjectIcon />} 
                    onClick={handleFetchData}>_API
                    </Button>
                    <Button 
                    variant="contained" 
                    startIcon={<UpdateIcon />} 
                    onClick={() => updateScoreboard(scoreboard_input)}>Update
                    </Button>
                </Stack>
        
            </Stack>
        </Container>
    );
};
