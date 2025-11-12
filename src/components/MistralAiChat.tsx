<<<<<<< HEAD
import React, { useState, type FormEvent } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Gavel as GavelIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

interface DopadNaOrganizaci {
  zmena: string;
  dopad: string;
}

interface AnalysisResponse {
  hlavniZmeny: string[];
  dopadyNaOrganizaci: DopadNaOrganizaci[];
  doporuceni: string[];
  shrnuti: string;
  model: string;
  tokensUsed: number;
}

const ORGANIZATION_TYPES = [
  'Obec',
  'Městský úřad',
  'Základní škola',
  'Střední škola',
  'Univerzita',
  'Nemocnice',
  'Zdravotnické zařízení',
  'Malá firma (do 50 zaměstnanců)',
  'Střední firma (50-250 zaměstnanců)',
  'Velká firma (250+ zaměstnanců)',
  'Nezisková organizace',
  'Spolky a sdružení'
];

const LegislativeAnalysisApp: React.FC = () => {
  const [profilOrganizace, setProfilOrganizace] = useState<string>('Obec');
  const [textZmeny, setTextZmeny] = useState<string>('');
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:8080/api/legislative';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!textZmeny.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profilOrganizace,
          textZmeny: textZmeny.trim(),
          temperature: 0.3,
          maxTokens: 3000
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Něco se pokazilo';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4 
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #A3C636 0%, #00413C 100%)',
              p: 2,
              borderRadius: 2,
              mr: 2
            }}
          >
            <GavelIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Legislativní Analytik AI
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vyhodnocení dopadu legislativních změn
            </Typography>
          </Box>
        </Box>

        {/* Input Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Typ organizace</InputLabel>
            <Select
              value={profilOrganizace}
              label="Typ organizace"
              onChange={(e) => setProfilOrganizace(e.target.value)}
              disabled={loading}
            >
              {ORGANIZATION_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon fontSize="small" />
                    {type}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            label="Text legislativní změny nebo novely"
            placeholder="Vložte text paragrafu, novely zákona nebo vyhlášky..."
            value={textZmeny}
            onChange={(e) => setTextZmeny(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading || !textZmeny.trim()}
            startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <DescriptionIcon />}
            sx={{
              background: 'linear-gradient(135deg, #A3C636 0%, #00413C 100%)',
              color: 'white',
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #92b530 0%, #003530 100%)',
              },
              '&.Mui-disabled': {
                background: 'linear-gradient(135deg, #A3C636 0%, #00413C 100%)',
                opacity: 0.6,
                color: 'white'
              }
            }}
          >
            {loading ? 'Analyzuji...' : 'Analyzovat dopad'}
          </Button>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            <Typography variant="body2" fontWeight="medium">{error}</Typography>
          </Alert>
        )}

        {/* Response */}
        {response && (
          <Box sx={{ mt: 4 }}>
            {/* Info chipsy */}
            <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
              <Chip label={profilOrganizace} color="primary" icon={<BusinessIcon />} />
              <Chip label={response.model} size="small" variant="outlined" />
              <Chip label={`${response.tokensUsed} tokenů`} size="small" variant="outlined" />
            </Stack>

            {/* Shrnutí */}
            <Card sx={{ mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  📋 Shrnutí
                </Typography>
                <Typography>{response.shrnuti}</Typography>
              </CardContent>
            </Card>

            {/* Hlavní změny */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  📝 Hlavní změny v legislativě
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {response.hlavniZmeny?.map((zmena, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={zmena} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>

            {/* Dopady */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  ⚠️ Dopady na vaši organizaci
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {response.dopadyNaOrganizaci?.map((item, idx) => (
                    <Card key={idx} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          {item.zmena}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">{item.dopad}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Doporučení */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  💡 Doporučené kroky
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {response.doporuceni?.map((doporuceni, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={doporuceni} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            ⚖️ Legislativní Analytik AI • Powered by Mistral AI & Spring Boot
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

=======
import React, { useState, type FormEvent } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Gavel as GavelIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

interface DopadNaOrganizaci {
  zmena: string;
  dopad: string;
}

interface AnalysisResponse {
  hlavniZmeny: string[];
  dopadyNaOrganizaci: DopadNaOrganizaci[];
  doporuceni: string[];
  shrnuti: string;
  model: string;
  tokensUsed: number;
}

const ORGANIZATION_TYPES = [
  'Obec',
  'Městský úřad',
  'Základní škola',
  'Střední škola',
  'Univerzita',
  'Nemocnice',
  'Zdravotnické zařízení',
  'Malá firma (do 50 zaměstnanců)',
  'Střední firma (50-250 zaměstnanců)',
  'Velká firma (250+ zaměstnanců)',
  'Nezisková organizace',
  'Spolky a sdružení'
];

const LegislativeAnalysisApp: React.FC = () => {
  const [profilOrganizace, setProfilOrganizace] = useState<string>('Obec');
  const [textZmeny, setTextZmeny] = useState<string>('');
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:8080/api/legislative';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!textZmeny.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profilOrganizace,
          textZmeny: textZmeny.trim(),
          temperature: 0.3,
          maxTokens: 3000
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Něco se pokazilo';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4 
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #A3C636 0%, #00413C 100%)',
              p: 2,
              borderRadius: 2,
              mr: 2
            }}
          >
            <GavelIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Legislativní Analytik AI
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vyhodnocení dopadu legislativních změn
            </Typography>
          </Box>
        </Box>

        {/* Input Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Typ organizace</InputLabel>
            <Select
              value={profilOrganizace}
              label="Typ organizace"
              onChange={(e) => setProfilOrganizace(e.target.value)}
              disabled={loading}
            >
              {ORGANIZATION_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon fontSize="small" />
                    {type}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            label="Text legislativní změny nebo novely"
            placeholder="Vložte text paragrafu, novely zákona nebo vyhlášky..."
            value={textZmeny}
            onChange={(e) => setTextZmeny(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading || !textZmeny.trim()}
            startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <DescriptionIcon />}
            sx={{
              background: 'linear-gradient(135deg, #A3C636 0%, #00413C 100%)',
              color: 'white',
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #92b530 0%, #003530 100%)',
              },
              '&.Mui-disabled': {
                background: 'linear-gradient(135deg, #A3C636 0%, #00413C 100%)',
                opacity: 0.6,
                color: 'white'
              }
            }}
          >
            {loading ? 'Analyzuji...' : 'Analyzovat dopad'}
          </Button>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            <Typography variant="body2" fontWeight="medium">{error}</Typography>
          </Alert>
        )}

        {/* Response */}
        {response && (
          <Box sx={{ mt: 4 }}>
            {/* Info chipsy */}
            <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
              <Chip label={profilOrganizace} color="primary" icon={<BusinessIcon />} />
              <Chip label={response.model} size="small" variant="outlined" />
              <Chip label={`${response.tokensUsed} tokenů`} size="small" variant="outlined" />
            </Stack>

            {/* Shrnutí */}
            <Card sx={{ mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  📋 Shrnutí
                </Typography>
                <Typography>{response.shrnuti}</Typography>
              </CardContent>
            </Card>

            {/* Hlavní změny */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  📝 Hlavní změny v legislativě
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {response.hlavniZmeny?.map((zmena, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={zmena} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>

            {/* Dopady */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  ⚠️ Dopady na vaši organizaci
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {response.dopadyNaOrganizaci?.map((item, idx) => (
                    <Card key={idx} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          {item.zmena}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">{item.dopad}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Doporučení */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  💡 Doporučené kroky
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {response.doporuceni?.map((doporuceni, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={doporuceni} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            ⚖️ Legislativní Analytik AI • Powered by Mistral AI & Spring Boot
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

>>>>>>> 0e95aa6d6617eb1ac2e126e8eba9a6dcde1dbc56
export default LegislativeAnalysisApp;