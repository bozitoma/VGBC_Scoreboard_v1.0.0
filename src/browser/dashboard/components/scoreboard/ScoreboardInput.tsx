import { FC } from "react";
import { TextField, Button, Stack, Box, Alert } from "@mui/material";
import { Update as UpdateIcon } from '@mui/icons-material';
import DataObjectIcon from '@mui/icons-material/DataObject';
import { Scoreboard } from "../../../../nodecg/generated/scoreboard";

interface ScoreboardInputProps {
    scoreboard_input: Scoreboard;
    url: string;
    errorMessage: string | null;
    handleFetchData: () => void;
    handleGetStreamQueue: () => void;
    setscoreboard_input: (value: ((prevState: Scoreboard) => Scoreboard) | Scoreboard) => void;
    setUrl: (value: string) => void;
    updateScoreboard: (scoreboard_input: Scoreboard) => void;
}

const ScoreboardInput: FC<ScoreboardInputProps> = ({
    scoreboard_input,
    url,
    errorMessage,
    handleFetchData,
    handleGetStreamQueue,
    setscoreboard_input,
    setUrl,
    updateScoreboard
}) => {
    return (
        <Box sx={{ p: 2 }}>
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
                        id="url" 
                        label="url" 
                        variant="outlined" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)} // URLの状態を更新
                    />
                </Stack>
            <Stack spacing={2} direction='row'>
                <Stack spacing={1}>
                    {/* Player 1's fields */}
                    <TextField 
                        id="player1_prefix" 
                        label="player1_prefix" 
                        variant="outlined" 
                        value={scoreboard_input.player1.prefix} 
                        onChange={(e) => {
                            setscoreboard_input(prev => ({
                                ...prev,
                                player1: {
                                    ...prev.player1,
                                    prefix: e.target.value
                                }
                            }))
                        }}
                    />
                    <TextField 
                        id="player1_name" 
                        label="player1_name" 
                        variant="outlined" 
                        value={scoreboard_input.player1.name} 
                        onChange={(e) => {
                            setscoreboard_input(prev => ({
                                ...prev,
                                player1: {
                                    ...prev.player1,
                                    name: e.target.value
                                }
                            }))
                        }}
                    />
                    <TextField 
                        id="player1_Xid" 
                        label="player1_Xid" 
                        variant="outlined" 
                        value={scoreboard_input.player1.xID} 
                        onChange={(e) => {
                            setscoreboard_input(prev => ({
                                ...prev,
                                player1: {
                                    ...prev.player1,
                                    Xid: e.target.value
                                }
                            }))
                        }}
                    />
                    <TextField 
                        id="player1_score" 
                        type="number" 
                        label="player1_score" 
                        variant="outlined" 
                        value={scoreboard_input.player1.score} 
                        onChange={(e) => {
                            setscoreboard_input(prev => ({
                                ...prev,
                                player1: {
                                    ...prev.player1,
                                    score: Number(e.target.value)
                                }
                            }))
                        }}
                    />
                </Stack>

                <Stack spacing={1}>
                    {/* Player 2's fields */}
                    <TextField 
                        id="player2_prefix" 
                        label="player2_prefix" 
                        variant="outlined" 
                        value={scoreboard_input.player2.prefix} 
                        onChange={(e) => {
                            setscoreboard_input(prev => ({
                                ...prev,
                                player2: {
                                    ...prev.player2,
                                    prefix: e.target.value
                                }
                            }))
                        }}
                    />
                    <TextField 
                        id="player2_name" 
                        label="player2_name" 
                        variant="outlined" 
                        value={scoreboard_input.player2.name} 
                        onChange={(e) => {
                            setscoreboard_input(prev => ({
                                ...prev,
                                player2: {
                                    ...prev.player2,
                                    name: e.target.value
                                }
                            }))
                        }}
                    />
                    <TextField 
                        id="player2_Xid" 
                        label="player2_Xid" 
                        variant="outlined" 
                        value={scoreboard_input.player2.xID} 
                        onChange={(e) => {
                            setscoreboard_input(prev => ({
                                ...prev,
                                player2: {
                                    ...prev.player2,
                                    Xid: e.target.value
                                }
                            }))
                        }}
                    />
                    <TextField 
                        id="player2_score" 
                        type="number" 
                        label="player2_score" 
                        variant="outlined" 
                        value={scoreboard_input.player2.score} 
                        onChange={(e) => {
                            setscoreboard_input(prev => ({
                                ...prev,
                                player2: {
                                    ...prev.player2,
                                    score: Number(e.target.value)
                                }
                            }))
                        }}
                    />
                </Stack>
            </Stack>
                <Stack spacing={2} direction='row'>
                    <Button 
                        variant="contained" 
                        onClick={handleGetStreamQueue}
                    >
                        getStreamQueue
                    </Button>
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
        </Box>
    );
};

export default ScoreboardInput;
