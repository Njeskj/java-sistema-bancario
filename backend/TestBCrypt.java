import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestBCrypt {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Gerar hash para "123456"
        String senha = "123456";
        String hash = encoder.encode(senha);
        System.out.println("Hash gerado: " + hash);
        
        // Testar hashes existentes
        String[] hashesParaTestar = {
            "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
            "$2a$12$LQv3c1yqBWVHxkd0LHAkCOEDh91cpFX4.jkjuQKuJ5hTmRXb6qKN2",
            "$2a$10$EblZqNptyYvcCm/TKF.bqO6fRi0pnMHKGxpNF2jRJQ2m1dH5FWk3y"
        };
        
        System.out.println("\nTestando hashes:");
        for (String h : hashesParaTestar) {
            boolean match = encoder.matches(senha, h);
            System.out.println("Hash: " + h.substring(0, 30) + "... = " + match);
        }
    }
}
