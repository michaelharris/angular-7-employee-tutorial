package mh.test;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
 
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Value("${app.username}")
    private String username;
    
    @Value("${app.password}")
    private String password;
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
    	//More specific rules should go first
    	http.csrf().disable().authorizeRequests()
    	.antMatchers("/healthcheck").permitAll()
    	.antMatchers("/employees").permitAll()
    	.antMatchers("/**").hasRole("USER")
    	.and().httpBasic();
    }
  
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication().withUser(username).password("{noop}" + password).roles("USER");
    }
}